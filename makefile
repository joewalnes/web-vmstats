
SHELL := /usr/bin/env bash
VER := 0.2.12


all:
	@export REL=$$(curl -s "https://github.com/joewalnes/websocketd/releases/latest" | cut -d\" -f2 | rev | cut -d/ -f1 | rev | cut -b 2-); \
	test -z "$$REL" && export REL=$(VER); \
	case "$$(uname -m)" in \
		x86_64) \
			export ARCH="amd64"; \
			;; \
		i386) \
			export ARCH="386"; \
			;; \
		arm*) \
			export ARCH="arm"; \
			;; \
		aarch64) \
			export ARCH="arm64"; \
			;; \
		*) \
			echo "arch is not supported"; \
			exit 10; \
			;; \
	esac; \
	case "$$(uname -s)" in \
		Darwin) \
			export OS="darwin"; \
			;; \
		Linux) \
			export OS="linux"; \
			;; \
		FreeBSD) \
			export OS="freebsd"; \
			;; \
		OpenBSD) \
			export OS="openbsd"; \
			;; \
		Solaris) \
			export OS="solaris"; \
			;; \
		*) \
			echo "os is not supported"; \
			exit 11; \
			;; \
	esac; \
	wget -c "https://github.com/joewalnes/websocketd/releases/download/v$${REL}/websocketd-$${REL}-$${OS}_$${ARCH}.zip" && unzip -o "websocketd-$${REL}-$${OS}_$${ARCH}.zip" websocketd; \
	rm websocketd-$${REL}-$${OS}_$${ARCH}.zip
