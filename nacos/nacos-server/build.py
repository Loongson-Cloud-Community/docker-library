import os
import subprocess
import re
import requests
from bs4 import BeautifulSoup

REPO = "https://github.com/nacos-group/nacos-docker"
download_url = "http://cloud.loongnix.cn/releases/loongarch64/alibaba/nacos/"

def url_sp(tag):
    # 拼接URL
    url = f"{download_url}{tag}/nacos-server-{tag}.tar.gz"
    print(f"Checking URL: {url}")

    try:
        # 发送HEAD请求，检查URL是否有效
        response = requests.head(url)

        # 如果状态码是200，说明文件存在
        if response.status_code == 200:
            print(f"URL is valid: {url}")
            return url
        else:
            print(f"URL is invalid, status code: {response.status_code}")
            return ""

    except requests.RequestException as e:
        print(f"Error while checking the URL: {e}")
        return ""

def get_tags(url):
    print(url)
    try:
        result = subprocess.run(
                ["git", "ls-remote", "--tags", url],
                capture_output=True, text=True, check=True
                )

        tags = set()
        for line in result.stdout.splitlines():
            match = re.search(r"refs/tags/([\w\.-]+)", line)
            print(match.group(1))
            #if match and valid_url(match.group(1).lstrip('v')) != "" :
            if match and url_sp(match.group(1).lstrip('v')) != "":
                tags.add(match.group(1))
        return sorted(tags)

    except subprocess.CalledProcessError as e:
        print(f"获取tag失败 msg: {e}")
        return []

#def _2La():
def fill_py_tag(file_path, tag, output_folder):
    """填充文件的 {py_tag} """
    if not os.path.exists(output_folder):
        os.mkdir(output_folder)

    try:
        with open(file_path, 'r') as file:
            file_content = file.read()

        file_content = file_content.replace("{py_tag}", tag)
        output_folder = output_folder+"/build"
        output_file = os.path.join(output_folder, os.path.basename(file_path))
        print(output_file)
        with open(output_file, 'w') as file:
            file.write(file_content)

        print(f"文件已经替换并保存到指定目录")

    except Exception as e:
        print(f"替换时报错，错误内容如下: {e}")


def pull_repo(tag):
    cmd = ["git", "clone", "--depth", "1", "-b", tag, REPO, tag]
    try:
        subprocess.run(cmd, check=True)
        print(f"成功执行克隆 {tag} 版本")
        fill_py_tag("Makefile", tag, f"{tag}")

        replace_in_files(tag, url_sp(tag.lstrip('v')))
        sub_dir = tag+"/build"
        run_dir = os.path.join(os.getcwd(), sub_dir)
#        subprocess.run(["cp", "-r", "bin", ], check=True)
        subprocess.run(["make", "push"], cwd=run_dir, check=True)
    except subprocess.CalledProcessError as e:
        print(f"[错误信息]: {e}")

def replace_in_files(tag, url):
    # 获取当前目录
    base_dir = os.getcwd()
    # 构建目标子目录路径
    target_dir = os.path.join(base_dir, tag)

    # 遍历目标目录及其子目录
    for root, dirs, files in os.walk(target_dir):
        for file_name in files:
            file_path = os.path.join(root, file_name)
            print(f"Processing file: {file_path}")

            try:
                # 读取文件内容，指定忽略错误的处理方式
                with open(file_path, 'r', encoding='utf-8', errors='ignore') as file:
                    content = file.read()

                # 执行替换操作
                # 1. 替换 centos:*
                content = re.sub(r'centos:[^\s]*', 'lcr.loongnix.cn/openanolis/anolisos:23.1', content)
                # 2. 替换 GitHub 下载链接
                content = re.sub(r'https://github\.com/alibaba/nacos/releases/download/\$\{NACOS_VERSION\}\$\{HOT_FIX_FLAG\}/nacos-server-\$\{NACOS_VERSION\}\.tar\.gz', url, content)
                # 3. 替换 amd64/buildpack-deps:buster-curl
                content = content.replace('amd64/buildpack-deps:buster-curl', 'lcr.loongnix.cn/library/buildpack-deps:sid-curl')
                # 4. 替换 openjdk:8-jre-slim
                content = content.replace('openjdk:8-jre-slim', 'lcr.loongnix.cn/library/openjdk:17')
                # 5. 添加安装tar
                content = content.replace(' yum install -y', ' yum install -y tar')
                # 6. 替换java版本
                content = content.replace('java-1.8.0', 'java-17')
                # 7. 修改java路径
                content = content.replace('/usr/local/openjdk-8', '/opt/java/openjdk')
                # 8. 特殊的java镜像
                content = content.replace('adoptopenjdk/openjdk8:jre8u372-b07', 'lcr.loongnix.cn/library/openjdk:17')
                # 将修改后的内容写回文件
                with open(file_path, 'w', encoding='utf-8') as file:
                    file.write(content)

            except Exception as e:
                print(f"Error processing file {file_path}: {e}")
    print("Replacement completed.")

def main():
    print("======开始执行======")
    tags = get_tags(REPO)
    if tags:
        print("找到tags")
        for tag in tags:
            pull_repo(tag)

if __name__ == "__main__":
    main()
