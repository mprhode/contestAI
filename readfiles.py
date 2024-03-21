



with open("names.txt", "r") as f:
    print(f.read())
    for l in f.readlines():
        print(l)
        print(l[0], ",", ",".join(l[1:]))



