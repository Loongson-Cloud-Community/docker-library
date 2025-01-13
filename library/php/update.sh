#!/bin/bash

# 定义需要查找的文件名称
FILE_NAME="Makefile"

# 定义需要插入的目标和规则
TARGET_NAME="image"
TARGET_RULE="\nimage: image-sid\n\t@\$(MAKE) image-sid\n"

# 遍历当前目录及子目录中的所有符合条件的文件
find . -type f -name "$FILE_NAME" | while read -r file; do
    echo "Processing $file ..."

    # 检查是否已经存在目标定义
    if grep -q "^${TARGET_NAME}:" "$file"; then
        echo "  Skipped: Target '${TARGET_NAME}' already exists in $file."
    else
        # 添加规则到文件末尾
        echo -e "$TARGET_RULE" >> "$file"
        echo "  Updated: Added target '${TARGET_NAME}' to $file."
    fi
done

echo "All files processed."

