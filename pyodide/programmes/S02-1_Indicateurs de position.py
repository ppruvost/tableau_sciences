def stats(d, f):
    v = np.repeat(d, f)
    for n, x in zip(["Mode", "Classe modale", "Moyenne", "Médiane", "Q1", "Q3"],
                    [d[np.argmax(f)], d[np.argmax(f)], np.average(d, weights=f), np.median(v), np.quantile(v, 0.25), np.quantile(v, 0.75)]):
        print(n, ":", round(x, 2))
stats(np.array([10,20,30,40]), [1,2,3,4])