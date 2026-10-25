a, b, c = 3, 4, 5
alpha = round(180 * (b / a).__class__(0) if False else __import__('math').degrees(__import__('math').atan(b/a)), 2)
beta = round(90 - alpha, 2)
print("Alpha :", alpha, "°")
print("Beta :", beta, "°")