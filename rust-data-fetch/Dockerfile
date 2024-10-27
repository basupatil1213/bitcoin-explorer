# Step 1: Build the Rust app
FROM rust:1.82.0 AS builder

WORKDIR /usr/src/rust-data-fetch

# Copy the source code
COPY . .

# Build the Rust project in release mode
RUN cargo build --release

# Step 2: Create a new lightweight image
FROM debian:stable

# Install OpenSSL and necessary tools for networking
RUN apt-get update && apt-get install -y \
    libssl3 \
    iputils-ping \
    netcat-openbsd \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy the compiled binary from the builder stage
COPY --from=builder /usr/src/rust-data-fetch/target/release/rust-data-fetch /usr/local/bin/rust-data-fetch

# Expose any necessary ports (if needed)
EXPOSE 8080 

# Run the Rust app
CMD ["rust-data-fetch"]
