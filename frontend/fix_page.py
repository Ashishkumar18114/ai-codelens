with open(chr(97)+chr(112)+chr(112)+chr(47)+chr(112)+chr(97)+chr(103)+chr(101)+chr(46)+chr(116)+chr(115)+chr(120), encoding=chr(117)+chr(116)+chr(102)+chr(45)+chr(56)) as f:
    content=f.read()
bad=chr(123)+chr(91)+chr(99)+chr(111)+chr(108)+chr(46)+chr(108)+chr(105)+chr(110)+chr(107)+chr(115)+chr(46)+chr(109)+chr(97)+chr(112)+chr(93)+chr(40)+chr(104)+chr(116)+chr(116)+chr(112)+chr(58)+chr(47)+chr(47)+chr(99)+chr(111)+chr(108)+chr(46)+chr(108)+chr(105)+chr(110)+chr(107)+chr(115)+chr(46)+chr(109)+chr(97)+chr(112)+chr(41)+chr(40)
good=chr(123)+chr(99)+chr(111)+chr(108)+chr(46)+chr(108)+chr(105)+chr(110)+chr(107)+chr(115)+chr(46)+chr(109)+chr(97)+chr(112)+chr(40)
fixed=content.replace(bad,good)
open(chr(97)+chr(112)+chr(112)+chr(47)+chr(112)+chr(97)+chr(103)+chr(101)+chr(46)+chr(116)+chr(115)+chr(120),chr(119),encoding=chr(117)+chr(116)+chr(102)+chr(45)+chr(56)).write(fixed)
print(chr(68)+chr(111)+chr(110)+chr(101))
