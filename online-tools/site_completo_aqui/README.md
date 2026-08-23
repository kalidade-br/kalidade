# Conteúdo do diretório

Este diretório foi criado para trazer o site completo do repositório público `emn178/online-tools` para dentro deste repositório.

Ao invés de copiar dezenas de milhares de arquivos diretamente (o que aumenta muito o tamanho do repositório), incluí um script simples que baixa e extrai a versão pública do repositório upstream para esta pasta. Execute o script localmente ou em um ambiente de CI para preencher `online-tools/site_completo_aqui` com todos os arquivos do site.

Avisos importantes:
- Os arquivos baixados virão diretamente do repositório público https://github.com/emn178/online-tools (branch `master`).
- Verifique a licença do projeto upstream (`LICENSE`) antes de redistribuir.

Como usar

1. No seu ambiente local (ou servidor), abra um terminal no diretório raiz deste repositório e execute:

   ```bash
   bash online-tools/site_completo_aqui/fetch_site.sh
   ```

   ou dê permissão e execute diretamente:

   ```bash
   chmod +x online-tools/site_completo_aqui/fetch_site.sh
   ./online-tools/site_completo_aqui/fetch_site.sh
   ```

2. O script irá baixar o ZIP do repositório upstream e extrair o conteúdo para `online-tools/site_completo_aqui/online-tools-master` (o nome do diretório criado pelo unzip). Se preferir os arquivos diretamente na pasta `site_completo_aqui`, veja o passo opcional no final do script para mover o conteúdo.

Se quiser que eu copie os arquivos diretamente para o repositório (commitando tudo em `main`), responda " copie tudo diretamente " e eu farei o processo — aviso que isso criará um commit muito grande e pode exceder limites de API/armazenamento para este espaço. 
