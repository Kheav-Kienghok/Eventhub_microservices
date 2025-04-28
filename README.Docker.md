# Deploying and Customizing Your Own API Services

This guide explains how to **customize**, **build**, and **deploy** your own APIs using **Docker** and **Kubernetes** (`Minikube`).

---

## 1. Customize and Build Your API

If you want to build or modify your own API and containerize it:

1. **Navigate to the desired service folder** (for example, the API Gateway service):
    ```bash
    cd API_Gateway
    ```

2. **Edit the `Dockerfile`** inside the folder as needed to customize your API logic, dependencies, or environment.

3. **Build the Docker image**:
    ```bash
    docker build -t your_dockerhub_username/api_gateway:your_tag .
    ```
    - Replace `your_dockerhub_username` with your Docker Hub username (or a local name if you're not pushing to Docker Hub).
    - Replace `your_tag` with the version tag, such as `v1.0` or `latest`.

4. **Update Kubernetes deployment files**:
    - Modify the image reference inside the corresponding `.yaml` files under the `k8s/` directory.
    - Example snippet inside a Kubernetes deployment YAML:
      ```yaml
      image: your_dockerhub_username/api_gateway:your_tag
      ```

---

## 2. Start Kubernetes Cluster and Deploy Services

Before deploying, make sure **Docker** and **Minikube** are installed on your machine.

### Start Minikube
```bash
minikube start
```


### (Optional) Open Minikube Dashboard

You can open the Minikube dashboard to visually monitor your cluster:

```bash
minikube dashboard
```

This command enables the Kubernetes dashboard add-on and opens it in your default web browser. If you prefer to obtain the dashboard URL without launching a browser, use:

```bash
minikube dashboard --url
```
> **Note:**  
> If you're operating in a headless environment or as the root user, the dashboard may not open automatically in a browser.  
> In such cases, use the `--url` flag to retrieve the dashboard URL and access it manually.

## 3. Apply Kubernetes Configurations

To deploy all services defined in the `k8s/` directory, execute:

```bash
kubectl apply -f k8s/
```

This command applies all Kubernetes resource configurations (Deployments, Services, etc.) specified in the YAML files within the `k8s/` directory. Using `kubectl apply` allows for declarative configuration management, enabling you to create or update resources based on the desired state defined in your YAML files. 

## 4. Expose Services

If your services are configured with the `LoadBalancer` type, you'll need to expose them externally using:

```bash
minikube tunnel
``` 

This command creates a network route on your host machine to services deployed with the `LoadBalancer` type, assigning them an external IP address accessible from your local environment. The tunnel must remain active while you're accessing these services.

> **Note:**  
> Running `minikube tunnel` may require administrative privileges, as it modifies network configurations on your host machine.

---

## 5. Test Service

Once your services are up and running:

1. Retrieve the external IP address assigned to your service:


```bash
kubectl get services
```
2. Use the external IP to test your API endpoints with tools like Postman or `curl`. For example:


### Using Custom Hostname with Ingress

> **Note:**  
> If you have configured an **Ingress** for your service, you can access your APIs using a **custom hostname** (e.g., `kheav-kienghok.com`) instead of using the external IP address directly. This allows you to use **friendly URLs** for your APIs while testing and can be particularly useful when managing multiple services under a single domain.

---

### Setting up Ingress

If you're using **Ingress** to route traffic to your services, ensure your Ingress resource is properly configured in your `k8s/` directory. Here’s a basic example of an Ingress YAML file that routes requests based on the hostname:

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: api-gateway-ingress
spec:
  ingressClassName: nginx
  rules:
    - host: kheav-kienghok.com   
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: api-gateway
                port:
                  number: 5000

```

- **host**: Specifies the custom hostname you’ll use for your API (in this case, `kheav-kienghok.com`).

- **service**: Defines the service that should handle requests for that hostname/path combination.

---

Once you have the **Ingress** resource configured, ensure that the **DNS** points to **Minikube's external IP** if you are using a custom hostname. This can be achieved by adding an entry in your system's **hosts** file (if you're using a local setup):

```bash
<minikube_external_ip> kheav-kienghok.com
```

You can then access your APIs via:

```bash
curl http://kheav-kienghok.com
```

Or using Postman with the same URL.
