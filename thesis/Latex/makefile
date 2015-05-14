filename=Abschlussarbeit.tex

dvi:
	pdflatex ${filename}
	bibtex ${filename}||true
	pdflatex ${filename}
	pdflatex ${filename}

read:
	evince ${filename}.pdf &

clean:
	rm -f ${filename}.{ps,log,aux,out,dvi,bbl,blg}
