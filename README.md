# File template plugins
Our target is help developers done their work faster and faster.
"File template" Help you to create a template and create file from that template quickly

## Features
### 1. Create a template
1. Open VSCode command prompt (ctrl + shift + P) -> type "File template: Create file from template" -> Hit enter
2. It will prompt an input to ask you the template name, my suggestion of your template name is [template-name].[template-extension], example: example.ts, example.service.ts, my-template.js, ...
3. Hit Enter after you type template name, it will open the template for you to edit it. <br>
We using Velocity, you can learn more about it [here](https://velocity.apache.org/engine/1.7/user-guide.html).
You can use $name variable, we will ask it when you create a file

### 1. Create a file from template
1. On the explorer (on the left menu), right click on the folder that you want to create a file.
2. It will ask you the file name, just type the file name and hit Enter