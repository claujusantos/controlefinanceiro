from datetime import datetime, timedelta, timezone
from typing import List, Dict, Optional

from app.database.connection import get_database
from app.models.financial import ResumoMensal, StatusSaldo


class DashboardService:
    """
    Serviço para analytics de dashboard, formatado para máxima legibilidade.
    """
    
    def __init__(self):
        self.db = get_database()

    
    async def get_dashboard_data(
        self, 
        user_id: str, 
        periodo: Optional[str] = None,
        data_inicio: Optional[str] = None,
        data_fim: Optional[str] = None
    ) -> Dict:
        
        # --- 1. Preparação do Filtro ---
        filtro_db = {"user_id": user_id}
        agora_utc = datetime.now(timezone.utc)

        if periodo == "ultimo_mes":
            filtro_db["mes"] = agora_utc.month
            filtro_db["ano"] = agora_utc.year
        
        elif periodo == "ultimos_6_meses":
            data_limite = agora_utc - timedelta(days=180)
            filtro_db["data"] = {"$gte": data_limite}
        
        elif periodo == "customizado" and data_inicio and data_fim:
            dt_inicio = datetime.strptime(
                data_inicio, "%Y-%m-%d"
            ).replace(tzinfo=timezone.utc)
            dt_fim = datetime.strptime(
                data_fim, "%Y-%m-%d"
            ).replace(tzinfo=timezone.utc) + timedelta(days=1)
            filtro_db["data"] = {"$gte": dt_inicio, "$lt": dt_fim}

        # --- 2. Busca dos Dados no Banco ---
        receitas_filtradas = await self.db.receitas.find(filtro_db).to_list(None)
        despesas_filtradas = await self.db.despesas.find(filtro_db).to_list(None)

        # --- 3. Cálculos Principais ---
        total_receitas = sum(r.get("valor", 0) for r in receitas_filtradas)
        total_despesas = sum(d.get("valor", 0) for d in despesas_filtradas)
        saldo = total_receitas - total_despesas
        percentual = (saldo / total_receitas * 100) if total_receitas > 0 else 0
        
        # --- 4. Processamento de Agrupamentos ---
        dist_categorias = {}
        for despesa in despesas_filtradas:
            categoria = despesa.get("categoria", "Outros")
            dist_categorias[categoria] = dist_categorias.get(
                categoria, 0
            ) + despesa.get("valor", 0)
        
        meses_e_anos = set((d.get("mes"), d.get("ano")) for d in despesas_filtradas)
        meses_e_anos.update((r.get("mes"), r.get("ano")) for r in receitas_filtradas)
        
        evolucao_mensal = []
        for mes, ano in sorted(filter(None, meses_e_anos)):
            receitas_no_mes = sum(
                r.get("valor", 0) for r in receitas_filtradas 
                if r.get("mes") == mes and r.get("ano") == ano
            )
            despesas_no_mes = sum(
                d.get("valor", 0) for d in despesas_filtradas 
                if d.get("mes") == mes and d.get("ano") == ano
            )
            evolucao_mensal.append({
                "mes": mes, "ano": ano,
                "receitas": receitas_no_mes,
                "despesas": despesas_no_mes,
                "saldo": receitas_no_mes - despesas_no_mes
            })
        
        # --- 5. Montagem do Retorno ---
        return {
            "total_receitas": total_receitas,
            "total_despesas": total_despesas,
            "saldo": saldo,
            "percentual_economia": round(percentual, 2),
            "lucro_prejuizo": (
                StatusSaldo.LUCRO.value if saldo >= 0 else StatusSaldo.PREJUIZO.value
            ),
            "categorias_distribuicao": [
                {"categoria": nome, "valor": valor_total} 
                for nome, valor_total in dist_categorias.items()
            ],
            "evolucao_mensal": evolucao_mensal
        }

    
    async def get_gastos_recorrentes(self, user_id: str) -> Dict:
        
        pipeline_categorias = [
            {"$match": {"user_id": user_id}},
            {
                "$group": {
                    "_id": "$categoria",
                    "ocorrencias": {"$sum": 1},
                    "valor_total": {"$sum": "$valor"}
                }
            },
            {
                "$project": {
                    "_id": 0, "categoria": "$_id", "ocorrencias": 1,
                    "valor_total": 1, 
                    "valor_medio": {"$divide": ["$valor_total", "$ocorrencias"]}
                }
            },
            {"$sort": {"ocorrencias": -1}},
            {"$limit": 10}
        ]
        
        pipeline_descricoes = [
            {"$match": {"user_id": user_id}},
            {
                "$group": {
                    "_id": {"$toLower": "$descricao"},
                    "ocorrencias": {"$sum": 1},
                    "valor_total": {"$sum": "$valor"},
                    "descricao_original": {"$first": "$descricao"}
                }
            },
            {"$match": {"ocorrencias": {"$gt": 1}}},
            {
                "$project": {
                    "_id": 0, "descricao": "$descricao_original",
                    "ocorrencias": 1, "valor_total": 1,
                    "valor_medio": {"$divide": ["$valor_total", "$ocorrencias"]}
                }
            },
            {"$sort": {"ocorrencias": -1}},
            {"$limit": 10}
        ]

        cat_agrupadas = await self.db.despesas.aggregate(pipeline_categorias).to_list(None)
        desc_agrupadas = await self.db.despesas.aggregate(pipeline_descricoes).to_list(None)
        
        if not cat_agrupadas:
            return {
                "categorias_mais_frequentes": [],
                "descricoes_recorrentes": [],
                "media_por_categoria": []
            }

        return {
            "categorias_mais_frequentes": cat_agrupadas,
            "descricoes_recorrentes": desc_agrupadas,
            "media_por_categoria": sorted(
                cat_agrupadas, key=lambda item: item["valor_total"], reverse=True
            )
        }

    
    async def get_resumo_mensal(self, user_id: str) -> List[ResumoMensal]:
        
        receitas = await self.db.receitas.find({"user_id": user_id}).to_list(None)
        despesas = await self.db.despesas.find({"user_id": user_id}).to_list(None)
        
        meses_e_anos = set((r.get("mes"), r.get("ano")) for r in receitas)
        meses_e_anos.update((d.get("mes"), d.get("ano")) for d in despesas)
        
        resumos = []
        for mes, ano in sorted(filter(None, meses_e_anos)):
            total_receitas_mes = sum(
                r.get("valor", 0) for r in receitas 
                if r.get("mes") == mes and r.get("ano") == ano
            )
            total_despesas_mes = sum(
                d.get("valor", 0) for d in despesas 
                if d.get("mes") == mes and d.get("ano") == ano
            )
            saldo = total_receitas_mes - total_despesas_mes
            percentual = (saldo / total_receitas_mes * 100) if total_receitas_mes > 0 else 0
            
            resumos.append(ResumoMensal(
                mes=mes, ano=ano, 
                total_receitas=total_receitas_mes, 
                total_despesas=total_despesas_mes,
                saldo=saldo, 
                percentual_economia=round(percentual, 2),
                lucro_prejuizo=(
                    StatusSaldo.LUCRO if saldo >= 0 else StatusSaldo.PREJUIZO
                )
            ))
        
        return resumos

    
    async def get_projecoes(self, user_id: str) -> Dict:
        
        # Etapa 1: Encontrar os últimos 3 meses com atividade
        pipeline_meses = [
            {"$match": {"user_id": user_id}},
            {"$group": {"_id": {"ano": "$ano", "mes": "$mes"}}},
            {"$sort": {"_id.ano": -1, "_id.mes": -1}},
            {"$limit": 3},
            {"$project": {"_id": 0, "ano": "$_id.ano", "mes": "$_id.mes"}}
        ]
        
        meses_receitas = await self.db.receitas.aggregate(pipeline_meses).to_list(None)
        meses_despesas = await self.db.despesas.aggregate(pipeline_meses).to_list(None)
        
        meses_combinados = sorted(
            list({(d['ano'], d['mes']) for d in meses_receitas + meses_despesas}),
            reverse=True
        )[:3]

        if not meses_combinados:
            return {
                "media_receitas": 0, "media_despesas": 0, 
                "saldo_projetado": 0, "tendencia": "neutro", 
                "projecao_6_meses": []
            }

        # Etapa 2: Criar filtro para buscar dados apenas desses meses
        filtro_periodo = {"$or": [
            {"ano": ano, "mes": mes} for ano, mes in meses_combinados
        ]}
        filtro_final = {"user_id": user_id, **filtro_periodo}

        # Etapa 3: Buscar os dados já filtrados
        receitas_periodo = await self.db.receitas.find(filtro_final).to_list(None)
        despesas_periodo = await self.db.despesas.find(filtro_final).to_list(None)

        # Etapa 4: Calcular média sobre um conjunto de dados muito menor
        total_receitas = sum(r['valor'] for r in receitas_periodo)
        total_despesas = sum(d['valor'] for d in despesas_periodo)
        
        num_meses = len(meses_combinados)
        media_receitas = total_receitas / num_meses if num_meses > 0 else 0
        media_despesas = total_despesas / num_meses if num_meses > 0 else 0
        saldo_projetado = media_receitas - media_despesas
        tendencia = "crescimento" if saldo_projetado > 0 else "declinio" if saldo_projetado < 0 else "neutro"

        projecao_futura = [
            {
                "mes": i + 1,
                "receita_estimada": round(media_receitas, 2),
                "despesa_estimada": round(media_despesas, 2),
                "saldo_estimado": round(saldo_projetado, 2),
            } 
            for i in range(6)
        ]

        # Etapa 5: Montagem do retorno
        return {
            "media_receitas": round(media_receitas, 2), 
            "media_despesas": round(media_despesas, 2),
            "saldo_projetado": round(saldo_projetado, 2), 
            "tendencia": tendencia,
            "projecao_6_meses": projecao_futura
        }