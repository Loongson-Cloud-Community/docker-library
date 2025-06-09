FROM lcr.loongnix.cn/pypa/manylinux_2_38_loongarch64

MAINTAINER wangweijie@loongson.cn

RUN yum install -y wget

RUN pipx install ninja -i https://lpypi.loongnix.cn/loongson/pypi/+simple

RUN mkdir -p /tmp/llvm &&\
    cd /tmp/llvm &&\
    wget -qO - https://ftp.loongnix.cn/toolchain/llvm/llvm15/llvm-project_15.0.7-1.src.tar.gz | tar -xzf - --strip-components=1 &&\
    mkdir llvm-build &&\
    cd llvm-build &&\
    cmake -G Ninja -DCMAKE_BUILD_TYPE=Release -DLLVM_ENABLE_PROJECTS="clang" -DCMAKE_INSTALL_PREFIX=/opt/llvm-15 -DLLVM_TARGETS_TO_BUILD="LoongArch" ../llvm/ &&\
    ninja && ninja install && rm -rf /tmp/*

ENV PATH="/opt/llvm-15/bin:$PATH"
