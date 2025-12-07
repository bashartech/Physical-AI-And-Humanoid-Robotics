# import os
# from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
# from sqlalchemy.orm import sessionmaker, declarative_base

# # Database connection string from environment variables
# DATABASE_URL = os.getenv("NEON_DATABASE_URL")

# if not DATABASE_URL:
#     print("Warning: NEON_DATABASE_URL is not set. Database features will be unavailable.")
#     # For local development or testing without Neon, you might fallback to SQLite or a mock.
#     # For now, we'll raise an error if critical.

# # Asynchronous engine for database connection
# # 'pool_pre_ping=True' helps with connection resilience, especially in serverless environments like Neon
# engine = create_async_engine(DATABASE_URL, echo=True, pool_pre_ping=True) if DATABASE_URL else None

# # Asynchronous session for database interactions
# AsyncSessionLocal = sessionmaker(
#     autocommit=False,
#     autoflush=False,
#     bind=engine,
#     class_=AsyncSession,
#     expire_on_commit=False,
# ) if DATABASE_URL else None

# Base = declarative_base()

# async def get_db():
#     if not AsyncSessionLocal:
#         raise ConnectionError("Database is not configured. NEON_DATABASE_URL is missing.")
#     async with AsyncSessionLocal() as session:
#         yield session

# # Example usage (not part of the main application flow, but for demonstration/testing)
# async def create_all_tables():
#     if engine:
#         async with engine.begin() as conn:
#             await conn.run_sync(Base.metadata.create_all)
#     else:
#         print("Database engine not initialized. Cannot create tables.")
