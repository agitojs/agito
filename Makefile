# Binaries
ISTANBUL ?= ./node_modules/.bin/istanbul
JSCS ?= ./node_modules/.bin/jscs
JSHINT ?= ./node_modules/.bin/jshint
MOCHA ?= ./node_modules/.bin/mocha
_MOCHA ?= ./node_modules/.bin/_mocha

# Options
ISTANBUL_FLAGS ?=
ISTANBUL_COVER_FLAGS ?= --report lcovonly
JSCS_FLAGS ?=
JSHINT_FLAGS ?=
MOCHA_FLAGS ?= --recursive --check-leaks --bail
MOCHA_FLAGS_TDD ?=  --watch --growl --debug

# Sources
JS_LIB := lib/
JS_TEST := test/


# Targets

all: lint test

lint: $(JS_LIB) $(JS_TEST)
	$(JSHINT) $(JSHINT_FLAGS) $^
	$(JSCS) $(JSCS_FLAGS) $^

test: $(JS_TEST)
	$(MOCHA) $(MOCHA_FLAGS) $^

tdd: $(JS_TEST)
	$(MOCHA) $(MOCHA_FLAGS) $(MOCHA_FLAGS_TDD) $^

cover: $(JS_TEST)
	$(ISTANBUL) $(ISTANBUL_FLAGS) cover $(_MOCHA) $(ISTANBUL_COVER_FLAGS) -- $(MOCHA_FLAGS) $^

.PHONY: all lint test tdd coverage
