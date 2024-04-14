<h1 align="center">📽️ Watch2Gether Services & Builder 🛠️</h1>

Uma reimaginação do website [Watch2Gether](https://w2g.tv/en/), porém feita utilizando uma arquitetura de microsserviços. Esse projeto foi criado com o intuito de aprender novas tecnologias (por exemplo: RabbitMQ e Angular) e ao mesmo tempo reescrever essa ferramenta em novas tecnologias.

Sumário:
- [1. Configurando a aplicação](#1-configurando-a-aplicação)
  - [1.1 Configurando a aplicação - Docker](#11-configurando-a-aplicação---docker)
  - [1.2 Configurando a aplicação - máquina local](#12-configurando-a-aplicação---máquina-local)
- [2. Limitações da aplicação](#2-limitações-da-aplicação)
- [3. Uso](#3-uso)
- [4. Tecnologias utilizadas](#4-tecnologias-utilizadas)
- [5. Licença](#5-licença)

# 1. Configurando a aplicação
A aplicação foi "dockerizada", sendo assim, é possível rodá-la em containers. Contudo, é necessário configurar inicialmente as variáveis de ambiente. Cada aplicação possui suas variáveis de ambiente, e na pasta de [variáveis de ambiente](./env/), você pode encontrar exemplos para cada aplicação.

## 1.1 Configurando a aplicação - Docker
Para configurar a aplicação com o Docker, você poderá utilizar tanto o arquivo de [Docker Compose normal](./docker-compose.yaml) quanto o arquivo de [Docker Compose local](./docker-compose-local.yaml). O Docker Compose normal aponta para as variáveis de ambiente que estão presentes na pasta `/env/[nome da aplicação]/env` (ideal para executar a aplicação caso você deseje alterar várias variáveis de ambiente), enquanto o Docker Compose local aponta para as variáveis de ambiente na pasta `/env/[nome da aplicação]/local` (ideal para executar a aplicação de maneira rápida, bastando apenas alterar o Token da API do Discord).

Além disso, eu criei uma ferramenta chamada "[Environment starter](./apps/envstarter/)" para auxiliar na criação dos arquivos de variáveis de ambiente, a qual pode ser baixada nas packages desse repositório. Para utilizá-la é simples: basta abrir o executável ".jar" com o comando `java -jar [nome do jar].jar`. Com isso, basta inserir o local da pasta raiz desse projeto e o Token da API do Discord e em seguida clicar em "Generate":
![Environment starter](./assets/envstarter-1.png)

Com isso, serão criados arquivos de variáveis de ambiente dentro das pastas `/env/[nome da aplicação]/env` espelhados nos arquivos de variáveis locais.

Por fim, na hora de subir o Compose é necessário que você selecione um dos serviços "nginx-dependencies" ou "nginx-no-dependencies" (não é possível selecionar os dois simultaneamente). O "nginx-dependencies" faz com que o Nginx suba após todas as aplicações subirem, enquanto o "nginx-no-dependencies" faz com que o Nginx suba sem depender de nenhuma aplicação.

## 1.2 Configurando a aplicação - máquina local
Para configurar a aplicação sem o Docker, é necessário que você execute as aplicações baseando-se nos exemplos de [arquivos de variáveis de ambiente](./env/).

# 2. Limitações da aplicação
A maior limitação atualmente da aplicação é o fato de ela não adicionar os comandos do bot no servidor assim que o mesmo entra na guilda. Como eu previamente disse: essa aplicação não é para ser levada a sério, mas sim como um mero experimento de tecnologias e aprendizados.

Para contornar esse problema, é necessário que você envie uma requisição HTTP do método "POST" para o endpoint `[endereço da aplicação "Messenger"]/messenger/command` ([definida nesse controlador](./apps/messenger/src/modules/messenger/controllers/messenger.controller.ts)). Segue exemplo usando o Thunder Client:
![Exemplo de requisição HTTP para definir os comandos](./assets/thunder-client-commands-1.png)

# 3. Uso
O uso dessa aplicação é relativamente simples: inicialmente você precisa marcar uma mensagem de delimitação no canal do Discord na qual você deseja "montar o Watch2Gether":
![Utilização do comando](./assets/command-usage-1.png)

Após isso, essa mensagem e todas as mensagens subsequentes terão o conteúdo de vídeos baixados (exemplo: vídeos do YouTube, vídeos do Instagram, etc.).

Com a definição de mensagem de delimitação, basta acessar o endereço do Front-end (via Angular é [localhost:4200](http://localhost:4200), via Docker com as configurações default é [localhost:80](http://localhost)), entrar na guilda e no canal desejado:
![Exemplo da aplicação](./assets/w2g-example-1.png)

# 4. Tecnologias utilizadas
- [Builder - aplicação responsável por montar a lista de vídeos para assistir](./apps/builder/): Kotlin com Spring no Java 21
- [Downloader - aplicação responsável por baixar os vídeos e armazenar na File Storage API](./apps/downloader/): Node.js com Nest e YoutubeDL
- [Environment Starter - GUI para gerar configurações de ambiente de maneira rápida](./apps/envstarter/): Java 21 com Swing (sim, Swing em 2024)
- [File Storage - aplicação responsável por armazenar arquivos](./apps/file-storage/): Quarkus e Java 21
- [Front-end](./apps/frontend/): Angular 17 e TailwindCSS
- [Messenger - aplicação que contém o Bot do Discord](./apps/messenger/): Node.js com Nest e Discord.js
- [Nginx - servidor geral](./apps/nginx/).

# 5. Licença
Sinta-se à vontade para fazer o que bem desejar com esse código.
