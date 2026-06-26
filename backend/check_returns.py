import ast

with open("main.py", "r", encoding="utf-8") as f:
    content = f.read()

tree = ast.parse(content, filename="main.py")

for node in ast.walk(tree):
    if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == "_process_single_video_in_thread":
        print(f"Found function _process_single_video_in_thread at line {node.lineno}")
        for subnode in ast.walk(node):
            if isinstance(subnode, ast.Return):
                print(f"Line {subnode.lineno}: {ast.unparse(subnode)}")
