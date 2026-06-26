import ast
import glob

# Collect all function definitions and their return lengths
func_returns = {}

def get_return_length(node):
    # Search for Return statements under this function node
    lengths = set()
    for subnode in ast.walk(node):
        # Stop nesting to avoid inner functions
        if isinstance(subnode, (ast.FunctionDef, ast.AsyncFunctionDef)) and subnode != node:
            continue
        if isinstance(subnode, ast.Return):
            val = subnode.value
            if val is None:
                lengths.add(1)
            elif isinstance(val, (ast.Tuple, ast.List)):
                lengths.add(len(val.elts))
            else:
                # Returns a single expression
                lengths.add(1)
    return lengths

for file in ["main.py", "Dude.py", "auth.py", "database.py", "s3_storage.py", "utils.py"]:
    try:
        with open(file, "r", encoding="utf-8") as f:
            tree = ast.parse(f.read(), filename=file)
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                lengths = get_return_length(node)
                func_returns[node.name] = (file, lengths)
    except Exception as e:
        print(f"Skipping {file}: {e}")

# Now analyze all assignments to see if there is any mismatch
for file in ["main.py", "Dude.py", "auth.py", "database.py", "s3_storage.py", "utils.py"]:
    try:
        with open(file, "r", encoding="utf-8") as f:
            content = f.read()
            tree = ast.parse(content, filename=file)
        
        for node in ast.walk(tree):
            if isinstance(node, ast.Assign):
                if len(node.targets) == 1 and isinstance(node.targets[0], (ast.Tuple, ast.List)):
                    target_len = len(node.targets[0].elts)
                    # Check if value is a call to one of our defined functions
                    val = node.value
                    if isinstance(val, ast.Call):
                        func_name = None
                        if isinstance(val.func, ast.Name):
                            func_name = val.func.id
                        elif isinstance(val.func, ast.Attribute) and isinstance(val.func.value, ast.Name) and val.func.value.id == "self":
                            func_name = val.func.attr
                        
                        if func_name and func_name in func_returns:
                            def_file, ret_lengths = func_returns[func_name]
                            # If any return length doesn't match target_len
                            mismatch = False
                            for l in ret_lengths:
                                if l != target_len:
                                    mismatch = True
                            if mismatch:
                                line = content.splitlines()[node.lineno - 1]
                                print(f"MISMATCH in {file}:{node.lineno}: {line.strip()}")
                                print(f"  Called '{func_name}' (defined in {def_file}) which returns {ret_lengths} values, but caller unpacks {target_len} values.")
                    elif isinstance(val, ast.Await) and isinstance(val.value, ast.Call):
                        # Handle async calls
                        call = val.value
                        func_name = None
                        if isinstance(call.func, ast.Name):
                            func_name = call.func.id
                        elif isinstance(call.func, ast.Attribute) and isinstance(call.func.value, ast.Name) and call.func.value.id == "self":
                            func_name = call.func.attr
                        
                        if func_name and func_name in func_returns:
                            def_file, ret_lengths = func_returns[func_name]
                            mismatch = False
                            for l in ret_lengths:
                                if l != target_len:
                                    mismatch = True
                            if mismatch:
                                line = content.splitlines()[node.lineno - 1]
                                print(f"MISMATCH (Await) in {file}:{node.lineno}: {line.strip()}")
                                print(f"  Called '{func_name}' (defined in {def_file}) which returns {ret_lengths} values, but caller unpacks {target_len} values.")
    except Exception as e:
        print(f"Skipping check for {file}: {e}")
