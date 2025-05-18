provider "kubernetes" {
  config_path = "/Users/baxuser/.kube/config" # Path to the kubeconfig file
}

# Create a Kubernetes namespace
resource "kubernetes_namespace" "macos" {
  metadata {
    name = "macos"
  }
}

# Deploy a PostgreSQL Pod
resource "kubernetes_pod" "postgresql" {
  metadata {
    name      = "postgres-db"
    namespace = kubernetes_namespace.macos.metadata[0].name
  }

  spec {
    container {
      name  = "postgres-container"
      image = "postgres:latest"

      # Set environment variables for PostgreSQL
      env {
        name  = "POSTGRES_USER"
        value = "admin"
      }

      env {
        name  = "POSTGRES_PASSWORD"
        value = "password"
      }

      env {
        name  = "POSTGRES_DB"
        value = "exampledb"
      }

      port {
        container_port = 5432
      }
    }
  }
}

# Create a Service to expose the PostgreSQL Pod
resource "kubernetes_service" "postgresql" {
  metadata {
    name      = "postgres-service"
    namespace = kubernetes_namespace.macos.metadata[0].name
  }

  spec {
    selector = {
      app = "postgres-db"
    }

    port {
      protocol    = "TCP"
      port        = 5432
      target_port = 5432
    }
  }
}