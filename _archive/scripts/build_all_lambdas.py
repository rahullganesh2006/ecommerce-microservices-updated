import os
import shutil
import subprocess
import sys

SERVICES = ["product-service", "cart-service", "inventory-service", "order-service", "payment-service"]
WORKSPACE = os.path.dirname(os.path.abspath(__file__))
OUTPUT_DIR = os.path.join(WORKSPACE, "lambda_packages")

def build_lambda(service_name):
    print(f"\n====================================================")
    print(f" Building Lambda Package for: {service_name}")
    print(f"====================================================")
    
    service_path = os.path.join(WORKSPACE, service_name)
    build_path = os.path.join(service_path, "lambda_build")
    
    # 1. Clean previous build
    if os.path.exists(build_path):
        shutil.rmtree(build_path)
    os.makedirs(build_path, exist_ok=True)
    
    # 2. Install dependencies with pip
    req_file = os.path.join(service_path, "requirements_lambda.txt")
    print("Installing Linux-compatible dependencies via pip...")
    cmd = [
        "pip", "install",
        "--platform", "manylinux2014_x86_64",
        "--target", build_path,
        "--implementation", "cp",
        "--python-version", "3.12",
        "--only-binary=:all:",
        "--upgrade",
        "-r", req_file
    ]
    try:
        subprocess.run(cmd, check=True)
    except subprocess.CalledProcessError as e:
        print(f"Error installing dependencies for {service_name}: {e}")
        return
    
    # 3. Copy application files
    print("Copying application files...")
    files_to_copy = ["app.py", "database.py", "security.py"]
    for file in files_to_copy:
        src = os.path.join(service_path, file)
        if os.path.exists(src):
            shutil.copy2(src, os.path.join(build_path, file))
            
    dirs_to_copy = ["routers", "schemas", "services", "repositories", "clients"]
    for folder in dirs_to_copy:
        src = os.path.join(service_path, folder)
        if os.path.exists(src):
            shutil.copytree(src, os.path.join(build_path, folder), dirs_exist_ok=True)
            
    # 4. Create ZIP archive
    print("Compressing package into zip...")
    zip_dest = os.path.join(service_path, "lambda_package")
    shutil.make_archive(zip_dest, 'zip', build_path)
    
    # 5. Move to final packages output directory
    final_dest = os.path.join(OUTPUT_DIR, f"{service_name}.zip")
    if os.path.exists(final_dest):
        os.remove(final_dest)
    shutil.move(f"{zip_dest}.zip", final_dest)
    
    # 6. Cleanup
    shutil.rmtree(build_path)
    print(f"Done packaging {service_name}!")

def main():
    if os.path.exists(OUTPUT_DIR):
        shutil.rmtree(OUTPUT_DIR)
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    for service in SERVICES:
        build_lambda(service)
        
    print("\n====================================================")
    print(f" All packages successfully built in: {OUTPUT_DIR}")
    print("====================================================")

if __name__ == "__main__":
    main()
