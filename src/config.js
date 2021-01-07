module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL ||  "postgres://yhtsqxrfcpfqwo:6dfb93e021682d30663a991f2bbbe05cb5cac8bdff9ac8d92cc6847ebbd9eefe@ec2-18-211-171-122.compute-1.amazonaws.com:5432/d9411o5lgsegt7",
    JWT_SECRET: process.env.JWT_SECRET || "change-this-secret",
  }

