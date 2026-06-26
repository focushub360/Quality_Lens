import ast
import glob
import os

files = glob.glob("**/*.py", recursive=True)

print("Searching python files for tuple unpacking...")

for file in files:
    if "venv" in file or "node_modules" in file:
        continue
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
        tree = ast.parse(content, filename=file)
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                # Check for two targets being unpacked: e.g. a, b = value
                if len(node.targets) == 1 and isinstance(node.targets[0], (ast.Tuple, ast.List)):
                    elts = node.targets[0].elts
                    if len(elts) == 2:
                        # Print the assignment line and file
                        line = content.splitlines()[node.lineno - 1]
                        print(f"{file}:{node.lineno}: {line.strip()}")
            elif isinstance(node, ast.For):
                # Check for two variables in for loop: e.g. for a, b in iterable
                if isinstance(node.target, (ast.Tuple, ast.List)):
                    elts = node.target.elts
                    if len(elts) == 2:
                        line = content.splitlines()[node.lineno - 1]
                        print(f"{file}:{node.lineno} (For): {line.strip()}")
    except Exception as e:
        print(f"Error parsing {file}: {e}")
