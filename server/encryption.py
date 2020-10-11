from passlib.context import CryptContext

# encryption setup
pwd_context = CryptContext(
    schemes=["sha256_crypt"],
)

# encrypts the password
def encrypt_password(password):
    return pwd_context.hash(password)


# checks if the password matches the hash
def check_encrypted_password(password, hashed):
    return pwd_context.verify(password, hashed)