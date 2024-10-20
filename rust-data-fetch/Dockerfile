# Step 1: Build the Rust app
FROM rust:1.82.0 AS builder

WORKDIR /usr/src/rust-data-fetch

# Copy the source code
COPY . .

# Build the Rust project in release mode
RUN cargo build --release

FROM debian:buster-slim

# Install necessary tools for networking
RUN apt-get update && apt-get install -y iputils-ping netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Copy the compiled binary from the builder stage
COPY --from=builder /usr/src/rust-data-fetch/target/release/rust-data-fetch /usr/local/bin/rust-data-fetch

# Expose any necessary ports (if needed)
EXPOSE 8080  
# Modify if your Rust app listens on a different port

# Run the Rust app
CMD ["rust-data-fetch"]
