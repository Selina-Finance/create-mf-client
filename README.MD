#publish steps
1. update package.json version
2. ```npm publish --access=public```
3. ```git tag v\<new_version_number\>```
3. ```git add . && git commit -m "updated version" && git push```