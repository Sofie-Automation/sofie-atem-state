# Changelog

All notable changes to this project will be documented in this file. See [Convential Commits](https://www.conventionalcommits.org/en/v1.0.0/#specification) for commit guidelines.

## [1.2.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/v1.1.0...v1.2.0) (Mon Aug 19 2024)


### Fixes

* resolveFlyKeyerFramesState state reversed + indexing [72953da](https://github.com/Sofie-Automation/sofie-atem-state/commit/72953da51045b067d8465f584176b8d2cd843f45)

### Features

* fly key settings (#28) [3e4ccf1](https://github.com/Sofie-Automation/sofie-atem-state/commit/3e4ccf190138823c4dd92fe279b77b5c4601e7c1)

## [1.1.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/v1.0.1...v1.1.0) (Thu Sep 28 2023)


### Fixes

* fairlight audio routing [ca94d36](https://github.com/Sofie-Automation/sofie-atem-state/commit/ca94d365a8ed158ea8796fc875fbb3d94ffccc2a)

### Features

* fairlight audio routing [99761eb](https://github.com/Sofie-Automation/sofie-atem-state/commit/99761eb10dd81158400849698f18fbfc0b09ca12)

## [1.0.1](https://github.com/Sofie-Automation/sofie-atem-state/compare/v1.0.0...v1.0.1) (Tue Mar 28 2023)


## [1.0.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.12.2...v1.0.0) (Tue Mar 28 2023)

## Breaking changes

### Features

* **!** require node 14 or 16 [258c966](https://github.com/Sofie-Automation/sofie-atem-state/commit/258c966f5d1b853cbce9809387c75cb5c04d2361)

### Features

* more sections and configurable diffing (#20) [8b329fe](https://github.com/Sofie-Automation/sofie-atem-state/commit/8b329fe953c9ba55df4fb34226b1f81ee0de22b9)

### [0.12.2](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.12.1...0.12.2) (2021-12-08)


### Bug Fixes

* update media player source before playback status ([78e7dca](https://github.com/Sofie-Automation/sofie-atem-state/commit/78e7dca9578997ba863b434e53cb551bccce86d9))

### [0.12.1](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.12.0...0.12.1) (2021-07-06)

## [0.12.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.10.1...0.12.0) (2021-07-05)


### Features

* code-standard-preset ([ebe74fa](https://github.com/Sofie-Automation/sofie-atem-state/commit/ebe74facee1171a0af7d61ea7232cda4f61ca009))
* handle partial state objects ([#18](https://github.com/Sofie-Automation/sofie-atem-state/issues/18)) ([7a6fdf2](https://github.com/Sofie-Automation/sofie-atem-state/commit/7a6fdf2e485862b30d574dfca6ee142927ff6b3f))
* move atem-connection to be a peer-dependency ([#19](https://github.com/Sofie-Automation/sofie-atem-state/issues/19)) ([ae33558](https://github.com/Sofie-Automation/sofie-atem-state/commit/ae3355808c06a717bdc2c8b1643f9f8cc9fae04d))


### Bug Fixes

* mediaplayer default values ([6fea863](https://github.com/Sofie-Automation/sofie-atem-state/commit/6fea863940003f87527cb375cf1dfe8fe9efa66e))

### [0.10.1](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.10.0...0.10.1) (2021-02-08)

## [0.10.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.9.0...0.10.0) (2020-08-17)


### ⚠ BREAKING CHANGES

* drop node 8 support

### Features

* drop node 8 support ([18513b7](https://github.com/Sofie-Automation/sofie-atem-state/commit/18513b706da1fed6d5847459a0ecdc637f0ad643))
* **ci:** optionally skip audit [skip ci] ([589f53f](https://github.com/Sofie-Automation/sofie-atem-state/commit/589f53f14fcbb4b09a7191f8270c2a3856bd0732))
* reexport atem-connection ([1cd205f](https://github.com/Sofie-Automation/sofie-atem-state/commit/1cd205fb46f1d818ec93a1a9b0054462c14d38b0))
* update resolvers to restructured atem-connection ([1af7ad8](https://github.com/Sofie-Automation/sofie-atem-state/commit/1af7ad85bd0a814e7426522a8d38902f360ffd1d))
* use result of updateProps to check if the command has changes ([8771517](https://github.com/Sofie-Automation/sofie-atem-state/commit/8771517648ab1a2e0008fcc89d10d6ceea073aeb))


### Bug Fixes

* improved typings for atem-state props + update atem-conn ([5da03cd](https://github.com/Sofie-Automation/sofie-atem-state/commit/5da03cd4067365ab5e5fe86b2836018780ca7d34))
* reenable upstream keyers ([99ac190](https://github.com/Sofie-Automation/sofie-atem-state/commit/99ac19070c8dc15775289dc08c7b9f767212db56))
* **dsk:** use correct state as new state ([00a0b66](https://github.com/Sofie-Automation/sofie-atem-state/commit/00a0b661cdedf80d471d1af7d6cc2920420eb97a))
* tests ([0222ce3](https://github.com/Sofie-Automation/sofie-atem-state/commit/0222ce3318059f5f99d70da379d6cdc2a777dcee))
* tidy up api ([43f7bb8](https://github.com/Sofie-Automation/sofie-atem-state/commit/43f7bb8c36c0eb6c8dede05436108de076e8f022))
* update to newer atem-connection api ([425a245](https://github.com/Sofie-Automation/sofie-atem-state/commit/425a245476b785c66a8dea9858e6515a7b54e67a))
* update typings ([7526f9d](https://github.com/Sofie-Automation/sofie-atem-state/commit/7526f9d415def04afaa511144350b6e3d6c72850))
* use exported atem-connection types ([f4a6728](https://github.com/Sofie-Automation/sofie-atem-state/commit/f4a672842a9217c4f6a0d37ed307ec9035384567))

## [0.9.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.8.1...0.9.0) (2020-02-17)


### Features

* media player control [publish] ([129121d](https://github.com/Sofie-Automation/sofie-atem-state/commit/129121da22781640b5ef5a8533965351409730ee))

### [0.8.1](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.8.0...0.8.1) (2019-11-21)


### Bug Fixes

* do not mutate input state objects ([43f6954](https://github.com/Sofie-Automation/sofie-atem-state/commit/43f6954dc21723520e3e172f2a6b4d621245a534))
* prevent falsy checks for input = 0 ([78ef630](https://github.com/Sofie-Automation/sofie-atem-state/commit/78ef630a27d3a05f239093c3569569fb4f95f2d1))

## [0.8.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.7.1...0.8.0) (2019-10-24)


### Features

* strict tsconfig ([9388f78](https://github.com/Sofie-Automation/sofie-atem-state/commit/9388f78527e5b77756eb54f753eb92e313d05459))
* support v8 ([cae23ff](https://github.com/Sofie-Automation/sofie-atem-state/commit/cae23ff06a6049dc83e2ff32db34f8e022e9e03b))
* update ci to run for node 8,10,12 ([06cf01d](https://github.com/Sofie-Automation/sofie-atem-state/commit/06cf01d6a4b355e450a5453858bd4a49f2591af9))


### Bug Fixes

* lint/build failure ([c6436f0](https://github.com/Sofie-Automation/sofie-atem-state/commit/c6436f0cd9e6e1456376e81a5945abae5c43a62b))
* pin atem-connection to a specific version ([a5fc4db](https://github.com/Sofie-Automation/sofie-atem-state/commit/a5fc4dba4e1adee9cf1a30a2205a596a3182b241))
* super source boxes for multiple super sources ([b222d1b](https://github.com/Sofie-Automation/sofie-atem-state/commit/b222d1bee948ac04b40aa088a4b7ef0904943ee9))

### [0.7.1](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.7.0...0.7.1) (2019-08-19)


### Features

* basic macro player control ([690fb89](https://github.com/Sofie-Automation/sofie-atem-state/commit/690fb89))
* basic macro player control ([#13](https://github.com/Sofie-Automation/sofie-atem-state/issues/13)) ([7f403a6](https://github.com/Sofie-Automation/sofie-atem-state/commit/7f403a6))

# [0.7.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.6.0...0.7.0) (2019-04-06)


### Features

* master audio ([5c9476a](https://github.com/Sofie-Automation/sofie-atem-state/commit/5c9476a))



# [0.6.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.5.0...0.6.0) (2019-03-27)


### Features

* Set transition position to 0 before running auto ([bb3d9f9](https://github.com/Sofie-Automation/sofie-atem-state/commit/bb3d9f9))



# [0.5.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.4.1...0.5.0) (2019-03-22)


### Features

* Audio Channels ([0bf0af7](https://github.com/Sofie-Automation/sofie-atem-state/commit/0bf0af7))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.8...0.4.0) (2018-11-02)


### Features

* rename downstreamKeyId to downstreamKeyerId ([19362fb](https://github.com/Sofie-Automation/sofie-atem-state/commit/19362fb))



<a name="0.3.8"></a>
## [0.3.8](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.7...0.3.8) (2018-10-24)



<a name="0.3.7"></a>
## [0.3.7](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.6...0.3.7) (2018-09-04)



<a name="0.3.6"></a>
## [0.3.6](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.5...0.3.6) (2018-08-17)



<a name="0.3.5"></a>
## [0.3.5](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.4...0.3.5) (2018-08-15)



<a name="0.3.4"></a>
## [0.3.4](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.3...0.3.4) (2018-08-14)


### Bug Fixes

* Transition style not being set to default at startup ([36a4da8](https://github.com/Sofie-Automation/sofie-atem-state/commit/36a4da8))



<a name="0.3.3"></a>
## [0.3.3](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.2...0.3.3) (2018-08-14)


### Bug Fixes

* look at input before programInput in oldState ([d0c4b73](https://github.com/Sofie-Automation/sofie-atem-state/commit/d0c4b73))
* look at old mixEffect for transitions (not new ME) ([bed621a](https://github.com/Sofie-Automation/sofie-atem-state/commit/bed621a))



<a name="0.3.2"></a>
## [0.3.2](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.1...0.3.2) (2018-08-09)


### Bug Fixes

* added missing guard ([c07c474](https://github.com/Sofie-Automation/sofie-atem-state/commit/c07c474))



<a name="0.3.1"></a>
## [0.3.1](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.3.0...0.3.1) (2018-08-07)


### Bug Fixes

* added guards for when number of ME:s isn't equal between the ATEM and the state ([3e072b2](https://github.com/Sofie-Automation/sofie-atem-state/commit/3e072b2))
* added some more guards ([cc234fe](https://github.com/Sofie-Automation/sofie-atem-state/commit/cc234fe))
* typo ([126a782](https://github.com/Sofie-Automation/sofie-atem-state/commit/126a782))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.2.0...0.3.0) (2018-07-31)


### Features

* Upstream Keyer tests ([223a808](https://github.com/Sofie-Automation/sofie-atem-state/commit/223a808))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.1.7...0.2.0) (2018-06-21)


### Features

* resolve halfway transition states ([f6cebcb](https://github.com/Sofie-Automation/sofie-atem-state/commit/f6cebcb))



<a name="0.1.7"></a>
## [0.1.7](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.1.6...0.1.7) (2018-06-21)



<a name="0.1.6"></a>
## [0.1.6](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.1.5...0.1.6) (2018-06-21)



<a name="0.1.5"></a>
## [0.1.5](https://github.com/Sofie-Automation/sofie-atem-state/compare/0.1.4...0.1.5) (2018-06-15)



<a name="0.1.4"></a>
## [0.1.4](https://github.com/nrk/sofie-atem-state/compare/0.1.3...0.1.4) (2018-06-15)



<a name="0.1.3"></a>
## [0.1.3](https://github.com/nrk/sofie-atem-state/compare/0.1.2...0.1.3) (2018-06-15)


### Bug Fixes

* update defaults to comply with actual atem defaults ([944de80](https://github.com/nrk/sofie-atem-state/commit/944de80))



<a name="0.1.2"></a>
## [0.1.2](https://github.com/nrk/sofie-atem-state/compare/0.1.1...0.1.2) (2018-06-14)


### Bug Fixes

* defaults should be based on capabilites ([434edff](https://github.com/nrk/sofie-atem-state/commit/434edff))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/nrk/sofie-atem-state/compare/0.1.0...0.1.1) (2018-06-14)


### Bug Fixes

* **upstream-key:** defaults for upstream key. guard against bits of upstream-key being undefined ([c932d9d](https://github.com/nrk/sofie-atem-state/commit/c932d9d))
* enforce setting certain properties after pattern change ([605758d](https://github.com/nrk/sofie-atem-state/commit/605758d))



<a name="0.1.0"></a>
# 0.1.0 (2018-06-10)


### Bug Fixes

* guard against settings for some transitions not being defined in the new settings ([4e52c51](https://github.com/nrk/sofie-atem-state/commit/4e52c51))
* imports come from main library exports ([2aa189c](https://github.com/nrk/sofie-atem-state/commit/2aa189c))
* merge command arrays ([a2b4655](https://github.com/nrk/sofie-atem-state/commit/a2b4655))
* remove falsy checks on enums, remove a typo ([ddbdd0a](https://github.com/nrk/sofie-atem-state/commit/ddbdd0a))
* remove ssh keys ([403ead2](https://github.com/nrk/sofie-atem-state/commit/403ead2))
* supersource failing as oldBox is undefined ([9d884b9](https://github.com/nrk/sofie-atem-state/commit/9d884b9))
* update atem-connection to 0.1.3 ([570f57f](https://github.com/nrk/sofie-atem-state/commit/570f57f))
* update dependencies ([20371ab](https://github.com/nrk/sofie-atem-state/commit/20371ab))


### Features

* abstraction for switching with ME structure ([b8672d9](https://github.com/nrk/sofie-atem-state/commit/b8672d9))
* auxiliary buses ([70d7e12](https://github.com/nrk/sofie-atem-state/commit/70d7e12))
* basic switching ([88af13c](https://github.com/nrk/sofie-atem-state/commit/88af13c))
* chroma keyer properties ([d5a7e2f](https://github.com/nrk/sofie-atem-state/commit/d5a7e2f))
* CircleCI features ([8bf152a](https://github.com/nrk/sofie-atem-state/commit/8bf152a))
* DSK properties ([743a926](https://github.com/nrk/sofie-atem-state/commit/743a926))
* DSK's (transitions / onair) ([1372bf2](https://github.com/nrk/sofie-atem-state/commit/1372bf2))
* DVE Keyer Properties ([1812993](https://github.com/nrk/sofie-atem-state/commit/1812993))
* export default parameters ([2fb9aec](https://github.com/nrk/sofie-atem-state/commit/2fb9aec))
* full unit tests ([eca6587](https://github.com/nrk/sofie-atem-state/commit/eca6587))
* luma keyer properties ([a87eaaa](https://github.com/nrk/sofie-atem-state/commit/a87eaaa))
* media player status ([5311c20](https://github.com/nrk/sofie-atem-state/commit/5311c20))
* pattern keyer properties ([609edcd](https://github.com/nrk/sofie-atem-state/commit/609edcd))
* supersource boxes ([752c2eb](https://github.com/nrk/sofie-atem-state/commit/752c2eb))
* Transition properties ([580bc8d](https://github.com/nrk/sofie-atem-state/commit/580bc8d))
* upstream keyer properties ([de239e8](https://github.com/nrk/sofie-atem-state/commit/de239e8))
* upstreamkeyer mask properties ([22dd53e](https://github.com/nrk/sofie-atem-state/commit/22dd53e))



# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.
