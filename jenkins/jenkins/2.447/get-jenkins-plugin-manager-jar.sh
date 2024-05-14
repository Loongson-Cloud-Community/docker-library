#!/bin/bash

git clone -b 2.12.15 --depth 1 https://github.com/jenkinsci/plugin-installation-manager-tool.git && cd plugin-installation-manager-tool && mvn package -DskipTests && cp plugin-management-cli/target/jenkins-plugin-manager-2.12.15.jar ../
