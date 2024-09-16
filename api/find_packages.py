import os
import re

def find_imports_in_file(file_path):
    with open(file_path, 'r') as file:
        content = file.read()
    imports = re.findall(r'^\s*(?:import|from)\s+([a-zA-Z0-9_\.]+)', content, re.MULTILINE)
    return imports

def scan_project_for_imports(project_path):
    packages = set()
    for root, _, files in os.walk(project_path):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                imports = find_imports_in_file(file_path)
                packages.update(imports)
    return packages

project_path = '.'  # Change this to your project directory if needed
packages = scan_project_for_imports(project_path)
print("Packages to install:")
for package in sorted(packages):
    print(package)