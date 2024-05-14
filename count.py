#!/usr/bin/python3

import os
import typing as t
import requests

def get_images_from_fs() -> t.List[t.Tuple[str, str]]:
    """
    获取到镜像的组织-名称；也就是获取到所有的二级目录
    """
    res = []

    for root, _, _ in os.walk("."):
        ## 忽略.git和.github目录
        if root.startswith("./.git") or root.startswith("./.github"):
            continue

        segs = root.split("/")

        ## segs[1]代表org_name，segs[2]代表image_name
        if len(segs)==3 and segs[0] == ".":
            res.append((segs[1], segs[2]))
    return res

class QUAYClient:
    """
    QUAY 的http请求客户端.
    """
    def __init__(self):
        pass

    def _tag_url(self, org_name: str, repo_name: str) -> str:
        return f"https://lcr.loongnix.cn/api/v1/repository/{org_name}/{repo_name}/tag/"
    
    def tags(self, org_name: str, repo_name: str) -> t.List[str]:
        """
        获取指定镜像所有的标签.
        """
        tag_url = self._tag_url(org_name, repo_name)
        params = dict(page=1, limit=100)
        resp = requests.get(url=tag_url, params=params)
        if not resp.ok:
            print(f"url={tag_url} 请求失败")
            return []
        
        res = []
        for tag in resp.json()["tags"]:
            tag_name = tag["name"]
            res.append(f"{org_name}/{repo_name}:{tag_name}")
        return res

def count_images() -> t.List[str]:
    """
    统计镜像的总数
    """
    res = []
    quay_client = QUAYClient()

    for org_name, repo_name in get_images_from_fs():
        for image_name in quay_client.tags(org_name, repo_name):
            res.append(image_name)

    return res

if __name__ == "__main__":
    images = count_images()
    print(f"镜像的总数为：{len(images)}")
