#FROM ubuntu:20.04
FROM lcr.loongnix.cn/library/debian:unstable

ARG WABT_VERSION=1.0.24
ARG BINARYEN_VERSION=version_103

ARG DEBIAN_FRONTEND=noninteractive
#RUN apt-get update && apt-get install -y curl git build-essential python
RUN echo "deb http://mirrors.ustc.edu.cn/debian unstable main" > /etc/apt/sources.list
RUN apt-get update && apt-get install -y curl git build-essential python-is-python3

#RUN bash -c 'echo -ne "deb http://apt.llvm.org/focal/ llvm-toolchain-focal-13 main\ndeb-src http://apt.llvm.org/focal/ llvm-toolchain-focal-13 main" > /etc/apt/sources.list.d/llvm.list'

#RUN curl -L https://apt.llvm.org/llvm-snapshot.gpg.key | apt-key add -

RUN apt-get update && \
    apt-get install -y \
      cmake \
      ninja-build \
      clang-17 \
      clang-format-17 \
      libc++-17-dev \
      lld-17
      #libc++abi-13-dev \
#&& \
#    update-alternatives --install /usr/bin/ld ld /usr/bin/lld-13 90 && \
#    update-alternatives --install /usr/bin/cc cc /usr/bin/clang-13 90 && \
#    update-alternatives --install /usr/bin/cpp cpp /usr/bin/clang++-13 90 && \
#    update-alternatives --install /usr/bin/c++ c++ /usr/bin/clang++-13 90
#
RUN ln -s /usr/bin/clang-17 /usr/bin/clang && \
    ln -s /usr/bin/clang++-17 /usr/bin/clang++ && \
    ln -s /usr/bin/clang-format-17 /usr/bin/clang-format && \
    ln -s /usr/bin/clang-cpp-17 /usr/bin/clang-cpp
#    ln -s /usr/bin/wasm-ld-13 /usr/bin/wasm-ld && \

RUN ln -s /usr/bin/wasm-ld-17 /usr/bin/wasm-ld
RUN git clone https://github.com/WebAssembly/wabt && \
    cd wabt && \
    git checkout $WABT_VERSION && \
    git submodule update --init && \
    sed -i '1i\#include <stdint.h>' third_party/gtest/googletest/src/gtest-death-test.cc && \
    sed -i "s/cmake_minimum_required(VERSION 3.0.0)/cmake_minimum_required(VERSION 3.5.0)/g" CMakeLists.txt && \
    make -j64

RUN git clone https://github.com/WebAssembly/binaryen && \
    cd binaryen && \
    git checkout $BINARYEN_VERSION && \
    cmake . -DCMAKE_CXX_FLAGS="-std=c++11 -Wno-bitwise-instead-of-logical -Wno-maybe-uninitialized" && \
    make -j64

ENV PATH="/binaryen/bin:/wabt/out/clang/Debug:${PATH}"

ENV CC=clang-17
ENV CXX=clang++-17

WORKDIR /src
