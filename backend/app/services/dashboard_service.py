from datetime import datetime, timedelta
from typing import List, Dict, Optional
from collections import Counter
from app.database.connection import get_database
from app.models.financial import ResumoMensal


class DashboardService:
    """Service for dashboard analytics and calculations"""
    
    def __init__(self):
        self.db = get_database()
    
    async def get_dashboard_data(
        self, 
        user_id: str, 
        periodo: Optional[str] = None,
        data_inicio: Optional[str] = None,
        data_fim: Optional[str] = None
    ) -> Dict:
        """Retorna dados agregados para o dashboard com filtros de data"""
        
        # Determinar o filtro baseado no período
        filtro = {}
        
        if periodo == "ultimo_mes":
            hoje = datetime.now()
            filtro["mes"] = hoje.month
            filtro["ano"] = hoje.year
        elif periodo == "ultimos_6_meses":
            pass  # Filtramos depois
        elif periodo == "customizado" and data_inicio and data_fim:
            pass  # Filtramos depois
        
        # Buscar todos os dados
        todas_receitas = await self.db.receitas.find({"user_id": user_id}).to_list(1000)
        todas_despesas = await self.db.despesas.find({"user_id": user_id}).to_list(1000)
        
        # Aplicar filtros de data customizada
        if periodo == "ultimos_6_meses":
            hoje = datetime.now()
            data_limite = hoje - timedelta(days=180)
            todas_receitas = [r for r in todas_receitas if datetime.strptime(r.get("data"), "%Y-%m-%d") >= data_limite]
            todas_despesas = [d for d in todas_despesas if datetime.strptime(d.get("data"), "%Y-%m-%d") >= data_limite]
        elif periodo == "customizado" and data_inicio and data_fim:
            dt_inicio = datetime.strptime(data_inicio, "%Y-%m-%d")
            dt_fim = datetime.strptime(data_fim, "%Y-%m-%d")
            todas_receitas = [r for r in todas_receitas if dt_inicio <= datetime.strptime(r.get("data"), "%Y-%m-%d") <= dt_fim]
            todas_despesas = [d for d in todas_despesas if dt_inicio <= datetime.strptime(d.get("data"), "%Y-%m-%d") <= dt_fim]
        elif periodo == "ultimo_mes":
            todas_receitas = [r for r in todas_receitas if r.get("mes") == filtro.get("mes") and r.get("ano") == filtro.get("ano")]
            todas_despesas = [d for d in todas_despesas if d.get("mes") == filtro.get("mes") and d.get("ano") == filtro.get("ano")]
        
        total_receitas = sum(r.get("valor", 0) for r in todas_receitas)
        total_despesas = sum(d.get("valor", 0) for d in todas_despesas)
        saldo = total_receitas - total_despesas
        percentual_economia = (saldo / total_receitas * 100) if total_receitas > 0 else 0
        
        # Distribuição por categorias (despesas)
        categorias_dist = {}
        for d in todas_despesas:
            cat = d.get("categoria", "Outros")
            categorias_dist[cat] = categorias_dist.get(cat, 0) + d.get("valor", 0)
        
        # Evolução mensal
        meses_anos = set()
        for r in todas_receitas:
            meses_anos.add((r.get("mes"), r.get("ano")))
        for d in todas_despesas:
            meses_anos.add((d.get("mes"), d.get("ano")))
        
        evolucao = []
        for m, a in sorted(meses_anos):
            recs = sum(r.get("valor", 0) for r in todas_receitas if r.get("mes") == m and r.get("ano") == a)
            desps = sum(d.get("valor", 0) for d in todas_despesas if d.get("mes") == m and d.get("ano") == a)
            evolucao.append({
                "mes": m,
                "ano": a,
                "receitas": recs,
                "despesas": desps,
                "saldo": recs - desps
            })
        
        return {
            "total_receitas": total_receitas,
            "total_despesas": total_despesas,
            "saldo": saldo,
            "percentual_economia": round(percentual_economia, 2),
            "lucro_prejuizo": "lucro" if saldo >= 0 else "prejuizo",
            "categorias_distribuicao": [{"categoria": k, "valor": v} for k, v in categorias_dist.items()],
            "evolucao_mensal": evolucao
        }
    
    async def get_gastos_recorrentes(self, user_id: str) -> Dict:
        """Retorna análise de gastos recorrentes e frequentes"""
        
        despesas = await self.db.despesas.find({"user_id": user_id}).to_list(1000)
        
        if not despesas:
            return {
                "categorias_mais_frequentes": [],
                "descricoes_recorrentes": [],
                "media_por_categoria": []
            }
        
        # Contar frequência por categoria
        categorias_count = Counter(d.get("categoria") for d in despesas)
        categorias_valores = {}
        categorias_ocorrencias = {}
        
        for d in despesas:
            cat = d.get("categoria", "Outros")
            if cat not in categorias_valores:
                categorias_valores[cat] = 0
                categorias_ocorrencias[cat] = 0
            categorias_valores[cat] += d.get("valor", 0)
            categorias_ocorrencias[cat] += 1
        
        # Categorias mais frequentes com valores
        categorias_freq = []
        for cat, count in categorias_count.most_common():
            categorias_freq.append({
                "categoria": cat,
                "ocorrencias": count,
                "valor_total": categorias_valores[cat],
                "valor_medio": categorias_valores[cat] / count if count > 0 else 0
            })
        
        # Descrições que se repetem (gastos recorrentes)
        descricoes_count = Counter(d.get("descricao").lower() for d in despesas)
        descricoes_recorrentes = []
        
        for desc, count in descricoes_count.most_common(10):
            if count > 1:  # Apenas descrições que aparecem mais de uma vez
                valor_total = sum(d.get("valor", 0) for d in despesas if d.get("descricao").lower() == desc)
                descricoes_recorrentes.append({
                    "descricao": desc.title(),
                    "ocorrencias": count,
                    "valor_total": valor_total,
                    "valor_medio": valor_total / count
                })
        
        # Média de gasto por categoria
        media_por_cat = []
        for cat, total in categorias_valores.items():
            count = categorias_ocorrencias[cat]
            media_por_cat.append({
                "categoria": cat,
                "media_gasto": total / count if count > 0 else 0,
                "total_gasto": total
            })
        
        # Ordenar por total gasto
        media_por_cat.sort(key=lambda x: x["total_gasto"], reverse=True)
        
        return {
            "categorias_mais_frequentes": categorias_freq[:10],
            "descricoes_recorrentes": descricoes_recorrentes,
            "media_por_categoria": media_por_cat
        }
    
    async def get_resumo_mensal(self, user_id: str) -> List[ResumoMensal]:
        """Retorna resumo de todos os meses"""
        receitas = await self.db.receitas.find({"user_id": user_id}).to_list(1000)
        despesas = await self.db.despesas.find({"user_id": user_id}).to_list(1000)
        
        meses_anos = set()
        for r in receitas:
            meses_anos.add((r.get("mes"), r.get("ano")))
        for d in despesas:
            meses_anos.add((d.get("mes"), d.get("ano")))
        
        resumos = []
        for m, a in sorted(meses_anos):
            total_rec = sum(r.get("valor", 0) for r in receitas if r.get("mes") == m and r.get("ano") == a)
            total_desp = sum(d.get("valor", 0) for d in despesas if d.get("mes") == m and d.get("ano") == a)
            saldo = total_rec - total_desp
            perc = (saldo / total_rec * 100) if total_rec > 0 else 0
            
            resumos.append(ResumoMensal(
                mes=m,
                ano=a,
                total_receitas=total_rec,
                total_despesas=total_desp,
                saldo=saldo,
                percentual_economia=round(perc, 2),
                lucro_prejuizo="lucro" if saldo >= 0 else "prejuizo"
            ))
        
        return resumos
    
    async def get_projecoes(self, user_id: str) -> Dict:
        """Calcula projeções financeiras baseadas nas médias"""
        receitas = await self.db.receitas.find({"user_id": user_id}).to_list(1000)
        despesas = await self.db.despesas.find({"user_id": user_id}).to_list(1000)
        
        if not receitas and not despesas:
            return {
                "media_receitas": 0,
                "media_despesas": 0,
                "saldo_projetado": 0,
                "tendencia": "neutro",
                "projecao_6_meses": [
                    {
                        "mes": i + 1,
                        "receita_estimada": 0,
                        "despesa_estimada": 0,
                        "saldo_estimado": 0
                    }
                    for i in range(6)
                ]
            }
        
        # Calcular médias dos últimos 3 meses
        meses_anos = set()
        for r in receitas:
            meses_anos.add((r.get("mes"), r.get("ano")))
        for d in despesas:
            meses_anos.add((d.get("mes"), d.get("ano")))
        
        ultimos_meses = sorted(meses_anos)[-3:]
        
        total_rec = 0
        total_desp = 0
        for m, a in ultimos_meses:
            total_rec += sum(r.get("valor", 0) for r in receitas if r.get("mes") == m and r.get("ano") == a)
            total_desp += sum(d.get("valor", 0) for d in despesas if d.get("mes") == m and d.get("ano") == a)
        
        media_rec = total_rec / len(ultimos_meses) if ultimos_meses else 0
        media_desp = total_desp / len(ultimos_meses) if ultimos_meses else 0
        saldo_proj = media_rec - media_desp
        
        tendencia = "crescimento" if saldo_proj > 0 else "declinio" if saldo_proj < 0 else "neutro"
        
        return {
            "media_receitas": round(media_rec, 2),
            "media_despesas": round(media_desp, 2),
            "saldo_projetado": round(saldo_proj, 2),
            "tendencia": tendencia,
            "projecao_6_meses": [
                {
                    "mes": i + 1,
                    "receita_estimada": round(media_rec, 2),
                    "despesa_estimada": round(media_desp, 2),
                    "saldo_estimado": round(saldo_proj, 2)
                }
                for i in range(6)
            ]
        }