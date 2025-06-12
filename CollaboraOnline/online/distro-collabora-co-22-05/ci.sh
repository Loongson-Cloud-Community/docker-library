#!/bin/bash

# --- Install Dependencies ---
echo "Detecting OS and installing dependencies..."

OS_ID=$(grep '^ID=' /etc/os-release | cut -d'=' -f2 | tr -d '"')

case "$OS_ID" in
    ubuntu|debian|loongnix)
        echo "Detected Ubuntu/Debian/Loongnix. Installing dependencies..."
        sudo apt update && \
        sudo apt install -y perl libperl-dev cpanminus gperf libffi-dev libx11-dev libxcb1-dev \
            libgl1-mesa-dev libpng-dev libcppunit-dev libpam0g-dev libcap-dev
        ;;
    rhel|centos|opencloudos)
        echo "Detected RHEL/CentOS/OpenCloudOS. Installing dependencies..."
        dnf install -y perl perl-CPAN gperf libffi-devel libX11-devel libxcb-devel \
            mesa-libGL-devel libpng-devel cppunit-devel pam-devel libcap-devel nodejs npm git sudo wget \
	    openssl-devel autoconf automake which bison flex patch unzip gettext bzip2 diffutils m4 \
	    libtool libzstd-devel pixman-devel cairo-devel libjpeg-turbo-devel pango-devel  \
	    giflib-devel python3-pip libxml2-devel libxslt-devel python3-devel gcc
        ;;
    arch)
        echo "Detected Arch Linux. Installing dependencies..."
        sudo pacman -Syu --noconfirm perl gperf libffi libx11 libxcb mesa libpng cppunit pam libcap
        ;;
    fedora|openEuler|anolisos|loongnix-server)
        echo "Detected $OS_ID. Skipping package installation as per script's instruction."
        ;;
    *)
        echo "Unsupported OS: $OS_ID"
        exit 1
        ;;
esac
# 执行更新，但忽略错误，因为有些镜像可能没有源或者更新速度慢
sudo $UPDATE_CMD > /dev/null 2>&1 || true

# 安装 sudo, git, nodejs, npm, 和 su (通常在util-linux或shadow-utils中)
# 确保安装成功，否则退出
if ! command -v sudo &> /dev/null; then
    echo "Installing sudo..."
    sudo $INSTALL_CMD sudo || { echo "Failed to install sudo. Exiting."; exit 1; }
fi

if ! command -v git &> /dev/null; then
    echo "Installing git..."
    sudo $INSTALL_CMD git || { echo "Failed to install git. Exiting."; exit 1; }
fi

if ! command -v npm &> /dev/null; then
    echo "Installing Node.js and npm..."
    # RHEL/CentOS/OpenCloudOS 系统可能需要 EPEL 仓库才能安装 Node.js/npm
    if [[ "$OS_ID" =~ ^(rhel|centos|opencloudos|fedora|openEuler|anolisos|loongnix-server)$ ]]; then
        # 尝试安装 epel-release (可能已经存在，或者不适用所有情况，故使用 || true)
        sudo $INSTALL_CMD epel-release || true
        # 启用Node.js模块，版本可调 (例如 nodejs:18 或 nodejs:20)
        # 仅当 dnf module 命令存在时才执行
        if command -v dnf module &> /dev/null; then
            sudo dnf module enable -y nodejs:20 || true
        fi
    fi
    sudo $INSTALL_CMD nodejs npm || { echo "Failed to install nodejs/npm. Exiting."; exit 1; }
fi

if ! command -v su &> /dev/null; then
    echo "Installing su (from util-linux or shadow-utils)..."
    case "$OS_ID" in
        ubuntu|debian|loongnix|arch)
            sudo $INSTALL_CMD util-linux || { echo "Failed to install util-linux. Exiting."; exit 1; }
            ;;
        rhel|centos|opencloudos|fedora|openEuler|anolisos|loongnix-server)
            sudo $INSTALL_CMD shadow-utils || { echo "Failed to install shadow-utils. Exiting."; exit 1; }
            ;;
        *)
            echo "Cannot determine package for 'su' on $OS_ID. Please install manually if needed."
            exit 1
            ;;
    esac
fi

echo "Essential tools check and installation complete."
echo "Dependency installation process complete."

# --- Git Configuration ---
echo "Configuring Git settings..."
git config --global http.postBuffer 524288000 && \
git config --global http.lowSpeedLimit 0 && \
git config --global http.lowSpeedTime 999999
echo "Git configuration complete."


npm config set registry https://registry.loongnix.cn:5873 && \
sudo npm config set registry https://registry.loongnix.cn:5873 && \
echo "配置npm完成"


#!/bin/bash

# 检查是否以root身份运行
if [ "$(id -u)" -ne 0 ]; then
    echo "请使用root用户或通过sudo运行此脚本"
    exit 1
fi

# 设置默认用户名，可以通过参数修改
USERNAME=${1:-devuser}

# 创建用户并设置家目录
useradd -m -s /bin/bash $USERNAME

# 将用户添加到wheel组（Fedora中wheel组默认有sudo权限）
usermod -aG wheel $USERNAME

# 配置免密sudo
echo "$USERNAME ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME
chmod 440 /etc/sudoers.d/$USERNAME

echo "已成功创建用户 $USERNAME 并配置免密sudo权限"
su devuser
sudo echo "works"

npm config set registry https://registry.loongnix.cn:5873 && \
sudo npm config set registry https://registry.loongnix.cn:5873 && \
pip install --upgrade pip
pip install polib http://lpypi.loongnix.cn/loongson/pypi/+f/f0f/91b752c7f502c/lxml-5.4.0-cp311-cp311-manylinux_2_38_loongarch64.whl#sha256=f0f91b752c7f502c4dc271a3edbfb57ab5a7cd973779395765813c288777afc3
echo "配置npm完成"

git config --global --add safe.directory /build/src
git config --global --add safe.directory /build/src/docker/from-source/builddir/core
git config --global --add safe.directory /build/src/docker/from-source/builddir/online
cd /build/src/docker/from-source/ && bash build.sh

