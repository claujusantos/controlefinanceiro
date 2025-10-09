from datetime import datetime

def extrair_mes_ano(data_str: str):
    """Extrai mês e ano de uma string de data YYYY-MM-DD"""
    try:
        data = datetime.strptime(data_str, "%Y-%m-%d")
        return data.month, data.year
    except:
        return 1, 2025