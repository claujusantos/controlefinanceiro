from fastapi import HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta, timezone # MUDANÇA: Importar timezone
import jwt
import bcrypt

from app.core.config import SECRET_KEY, ALGORITHM, ACCESS_TOKEN_EXPIRE_MINUTES
from app.database.connection import get_database
from app.models.user import Usuario

class AuthService:
    security = HTTPBearer()
    db = get_database()

    @staticmethod
    def hash_senha(senha: str) -> str:
        """Gera hash da senha de forma segura."""
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(senha.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')

    @staticmethod
    def verificar_senha(senha: str, senha_hash: str) -> bool:
        """Verifica se a senha corresponde ao hash."""
        return bcrypt.checkpw(senha.encode('utf-8'), senha_hash.encode('utf-8'))

    def criar_token(self, user_id: str, email: str) -> str:
        """Cria um novo token JWT."""
        agora_utc = datetime.now(timezone.utc) # CORREÇÃO: Usando a forma moderna
        payload = {
            "sub": user_id,
            "email": email,
            "exp": agora_utc + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
            "iat": agora_utc
        }
        return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)

    def verificar_token(self, token: str) -> dict:
        """Verifica e decodifica um token JWT."""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=401,
                detail="Token expirado",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except jwt.InvalidTokenError:
            raise HTTPException(
                status_code=401,
                detail="Token inválido ou malformado",
                headers={"WWW-Authenticate": "Bearer"},
            )

    async def get_current_user(self, credentials: HTTPAuthorizationCredentials = Depends(security)) -> Usuario:
        """Dependência para obter o usuário atual a partir do token."""
        token = credentials.credentials
        payload = self.verificar_token(token)
        user_id = payload.get("sub")
        
        if user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Token inválido, 'sub' não encontrado",
                headers={"WWW-Authenticate": "Bearer"},
            )

        usuario_dict = await self.db.usuarios.find_one({"id": user_id})
        if not usuario_dict:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
        
        return Usuario(**usuario_dict)