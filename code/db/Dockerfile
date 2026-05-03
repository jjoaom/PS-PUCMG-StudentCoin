# =========================
# Dockerfile — MySQL
# Apenas para desenvolvimento local
# =========================
FROM mysql:8.0.45-debian

# Atualiza pacote libpng para corrigir CVE-2026-25646
RUN apt-get update && apt-get install -y libpng-dev && rm -rf /var/lib/apt/lists/*

# Copiar configurações customizadas do MySQL
COPY my.cnf /etc/mysql/conf.d/my.cnf

# Copiar scripts SQL de inicialização
# INSIRA OS ARQUIVOS .SQL no diretório INIT
COPY init/ /docker-entrypoint-initdb.d/

# Permissões corretas para os scripts de init
RUN chmod 644 /etc/mysql/conf.d/my.cnf \
 && chmod -R 644 /docker-entrypoint-initdb.d/

# Container Healthcheck
HEALTHCHECK --interval=10s --timeout=5s --retries=5 --start-period=30s \
  CMD mysqladmin ping -h localhost -u root -p$MYSQL_ROOT_PASSWORD

EXPOSE 3306
