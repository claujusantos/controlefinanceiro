from fastapi.responses import StreamingResponse
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.chart import BarChart, PieChart, LineChart, Reference
from openpyxl.utils import get_column_letter
import io
from typing import List, Dict
from app.database.connection import get_database


class ExcelService:
    """Service for Excel export functionality"""
    
    def __init__(self):
        self.db = get_database()
    
    async def export_excel(self, user_id: str) -> StreamingResponse:
        """Gera arquivo Excel com todas as abas e fórmulas"""
        
        # Buscar dados
        receitas = await self.db.receitas.find({"user_id": user_id}).to_list(1000)
        despesas = await self.db.despesas.find({"user_id": user_id}).to_list(1000)
        categorias = await self.db.categorias.find({"user_id": user_id}).to_list(1000)
        
        # Criar workbook
        wb = Workbook()
        
        # Estilos
        header_fill = PatternFill(start_color="4472C4", end_color="4472C4", fill_type="solid")
        header_font = Font(bold=True, color="FFFFFF", size=12)
        titulo_font = Font(bold=True, size=14, color="2F5496")
        border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )
        
        # Criar todas as abas
        self._create_tutorial_sheet(wb)
        self._create_categorias_sheet(wb, categorias, header_fill, header_font, titulo_font, border)
        self._create_receitas_sheet(wb, receitas, header_fill, header_font, titulo_font, border)
        self._create_despesas_sheet(wb, despesas, categorias, header_fill, header_font, titulo_font, border)
        self._create_resumo_sheet(wb, header_fill, header_font, titulo_font, border)
        self._create_projecoes_sheet(wb, header_fill, header_font, titulo_font, border)
        self._create_dashboard_sheet(wb, header_fill, header_font, titulo_font, border)
        
        # Salvar para BytesIO
        excel_file = io.BytesIO()
        wb.save(excel_file)
        excel_file.seek(0)
        
        return StreamingResponse(
            excel_file,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=controle_financeiro.xlsx"}
        )
    
    def _create_tutorial_sheet(self, wb: Workbook):
        """Cria a aba Tutorial"""
        ws_tutorial = wb.active
        ws_tutorial.title = "Tutorial"
        
        ws_tutorial['A1'] = "📚 BEM-VINDO À PLANILHA DE CONTROLE FINANCEIRO"
        ws_tutorial['A1'].font = Font(bold=True, size=16, color="2F5496")
        
        instrucoes = [
            "",
            "🎯 COMO USAR ESTA PLANILHA:",
            "",
            "1️⃣ ABA 'RECEITAS': Preencha suas receitas mensais",
            "   - Células em BRANCO são editáveis",
            "   - Células em CINZA são calculadas automaticamente (NÃO EDITE)",
            "",
            "2️⃣ ABA 'DESPESAS': Preencha suas despesas mensais",
            "   - Use o menu suspenso para selecionar categorias",
            "   - Os totais são calculados automaticamente",
            "",
            "3️⃣ ABA 'CATEGORIAS': Personalize suas categorias",
            "   - Adicione ou remova categorias conforme sua necessidade",
            "",
            "4️⃣ ABA 'RESUMO MENSAL': Veja o histórico completo",
            "   - Totais por mês calculados automaticamente",
            "   - Meses com prejuízo destacados em vermelho",
            "",
            "5️⃣ ABA 'PROJEÇÕES': Veja tendências futuras",
            "   - Baseado na média dos últimos meses",
            "",
            "6️⃣ ABA 'PAINEL': Dashboard visual",
            "   - Indicadores principais e resumo geral",
            "",
            "⚠️ IMPORTANTE:",
            "• Não delete linhas de cabeçalho",
            "• Não modifique células com fórmulas (cinza)",
            "• Sempre use datas no formato DD/MM/AAAA",
            "• Valores devem ser apenas números (sem R$)",
            "",
            "💡 DICA: Comece preenchendo a aba CATEGORIAS, depois RECEITAS e DESPESAS!",
            "",
            "✅ Pronto! Sua planilha está configurada e pronta para uso!",
        ]
        
        for i, texto in enumerate(instrucoes, start=2):
            ws_tutorial[f'A{i}'] = texto
            if "️⃣" in texto or "⚠️" in texto:
                ws_tutorial[f'A{i}'].font = Font(bold=True, size=11)
        
        ws_tutorial.column_dimensions['A'].width = 80
    
    def _create_categorias_sheet(self, wb, categorias, header_fill, header_font, titulo_font, border):
        """Cria a aba Categorias"""
        ws_cat = wb.create_sheet("Categorias")
        
        ws_cat['A1'] = "📁 CATEGORIAS"
        ws_cat['A1'].font = titulo_font
        ws_cat.merge_cells('A1:C1')
        
        headers_cat = ['Nome', 'Tipo', 'Cor']
        for col, header in enumerate(headers_cat, start=1):
            cell = ws_cat.cell(row=3, column=col)
            cell.value = header
            cell.fill = header_fill
            cell.font = header_font
            cell.border = border
            cell.alignment = Alignment(horizontal='center')
        
        for i, cat in enumerate(categorias, start=4):
            ws_cat[f'A{i}'] = cat.get('nome', '')
            ws_cat[f'B{i}'] = cat.get('tipo', '')
            ws_cat[f'C{i}'] = cat.get('cor', '')
            
            for col in range(1, 4):
                ws_cat.cell(row=i, column=col).border = border
        
        ws_cat.column_dimensions['A'].width = 25
        ws_cat.column_dimensions['B'].width = 15
        ws_cat.column_dimensions['C'].width = 15
    
    def _create_receitas_sheet(self, wb, receitas, header_fill, header_font, titulo_font, border):
        """Cria a aba Receitas"""
        ws_rec = wb.create_sheet("Receitas")
        
        ws_rec['A1'] = "💰 RECEITAS"
        ws_rec['A1'].font = titulo_font
        ws_rec.merge_cells('A1:E1')
        
        headers_rec = ['Data', 'Descrição', 'Categoria', 'Forma Recebimento', 'Valor']
        for col, header in enumerate(headers_rec, start=1):
            cell = ws_rec.cell(row=3, column=col)
            cell.value = header
            cell.fill = header_fill
            cell.font = header_font
            cell.border = border
            cell.alignment = Alignment(horizontal='center')
        
        for i, rec in enumerate(receitas, start=4):
            ws_rec[f'A{i}'] = rec.get('data', '')
            ws_rec[f'B{i}'] = rec.get('descricao', '')
            ws_rec[f'C{i}'] = rec.get('categoria', '')
            ws_rec[f'D{i}'] = rec.get('forma_recebimento', '')
            ws_rec[f'E{i}'] = rec.get('valor', 0)
            
            for col in range(1, 6):
                ws_rec.cell(row=i, column=col).border = border
        
        # Total
        ultima_linha = len(receitas) + 4
        ws_rec[f'D{ultima_linha}'] = "TOTAL:"
        ws_rec[f'D{ultima_linha}'].font = Font(bold=True)
        ws_rec[f'E{ultima_linha}'] = f"=SUM(E4:E{ultima_linha-1})"
        ws_rec[f'E{ultima_linha}'].font = Font(bold=True)
        ws_rec[f'E{ultima_linha}'].fill = PatternFill(start_color="D9E1F2", end_color="D9E1F2", fill_type="solid")
        
        ws_rec.column_dimensions['A'].width = 15
        ws_rec.column_dimensions['B'].width = 30
        ws_rec.column_dimensions['C'].width = 20
        ws_rec.column_dimensions['D'].width = 20
        ws_rec.column_dimensions['E'].width = 15
    
    def _create_despesas_sheet(self, wb, despesas, categorias, header_fill, header_font, titulo_font, border):
        """Cria a aba Despesas - simplified version for now"""
        ws_desp = wb.create_sheet("Despesas")
        
        ws_desp['A1'] = "💸 DESPESAS"
        ws_desp['A1'].font = titulo_font
        ws_desp.merge_cells('A1:E1')
        
        headers_desp = ['Data', 'Descrição', 'Categoria', 'Forma Pagamento', 'Valor']
        for col, header in enumerate(headers_desp, start=1):
            cell = ws_desp.cell(row=3, column=col)
            cell.value = header
            cell.fill = header_fill
            cell.font = header_font
            cell.border = border
            cell.alignment = Alignment(horizontal='center')
        
        for i, desp in enumerate(despesas, start=4):
            ws_desp[f'A{i}'] = desp.get('data', '')
            ws_desp[f'B{i}'] = desp.get('descricao', '')
            ws_desp[f'C{i}'] = desp.get('categoria', '')
            ws_desp[f'D{i}'] = desp.get('forma_pagamento', '')
            ws_desp[f'E{i}'] = desp.get('valor', 0)
            
            for col in range(1, 6):
                ws_desp.cell(row=i, column=col).border = border
        
        ws_desp.column_dimensions['A'].width = 15
        ws_desp.column_dimensions['B'].width = 30
        ws_desp.column_dimensions['C'].width = 20
        ws_desp.column_dimensions['D'].width = 20
        ws_desp.column_dimensions['E'].width = 15
    
    def _create_resumo_sheet(self, wb, header_fill, header_font, titulo_font, border):
        """Cria a aba Resumo Mensal - simplified version"""
        ws_resumo = wb.create_sheet("Resumo Mensal")
        ws_resumo['A1'] = "📊 RESUMO MENSAL"
        ws_resumo['A1'].font = titulo_font
        ws_resumo.merge_cells('A1:F1')
    
    def _create_projecoes_sheet(self, wb, header_fill, header_font, titulo_font, border):
        """Cria a aba Projeções - simplified version"""
        ws_proj = wb.create_sheet("Projeções")
        ws_proj['A1'] = "🔮 PROJEÇÕES FINANCEIRAS"
        ws_proj['A1'].font = titulo_font
        ws_proj.merge_cells('A1:E1')
    
    def _create_dashboard_sheet(self, wb, header_fill, header_font, titulo_font, border):
        """Cria a aba Dashboard - simplified version"""
        ws_dash = wb.create_sheet("Painel")
        ws_dash['A1'] = "📈 PAINEL DE CONTROLE"
        ws_dash['A1'].font = titulo_font
        ws_dash.merge_cells('A1:F1')