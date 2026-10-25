def stats(d, f):
    v = numpy.repeat(d, f)
    print("Étendue :", max(v)-min(v))
    print("Écart-type :", round(numpy.std(v), 2))
    print("Écart interquartile :", round(numpy.quantile(v, 0.75)-numpy.quantile(v, 0.25), 2))
stats([10,20,30,40], [1,2,3,4])