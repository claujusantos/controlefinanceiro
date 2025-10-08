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