import os
from pathlib import Path
from dotenv import load_dotenv

ROOT_DIR = Path(__file__).parent.parent.parent
load_dotenv(ROOT_DIR / '.env')

#TODO: REMOVER A STR EMFRENTE DA CHAVE SUPER SEGURA PELO AMOR DE DEUS!!!!!!!!!!!!!!!!!!!!!!!
# Security
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'sua-chave-secreta-super-segura-mude-em-producao')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 dias

# Database
MONGO_URL = os.environ['MONGO_URL']
DB_NAME = os.environ['DB_NAME']