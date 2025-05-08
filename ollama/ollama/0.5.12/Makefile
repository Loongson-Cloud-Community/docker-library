src: clean
	git clone --depth 1 -b 0.5.12-loong64 https://github.com/Loongson-Cloud-Community/ollama src
image: src
	cd src && bash ci.sh

push:
	cd src && bash ci.sh

clean:
	rm -rf src
