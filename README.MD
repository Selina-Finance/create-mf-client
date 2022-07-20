#publish steps
1. update package.json version
2. ```git tag v\<new_version_number\>```
3. ```git add . && git commit -m "updated version" && git push```
4. ```npm publish```