# PackZone

Site responsivo inspirado na referência enviada, com identidade própria em preto + verde.

## O que já funciona
- Catálogo responsivo
- Categorias
- Busca
- Carrinho com localStorage
- Modal de checkout
- Layout mobile
- Estrutura pronta para substituir os produtos e textos

## Para vender de verdade
A parte de pagamento e entrega digital precisa de backend. Uma arquitetura simples:

Frontend (este projeto) -> API/Edge Function -> Mercado Pago/Stripe
                                      -> webhook de pagamento aprovado
                                      -> libera o link/arquivo do pack ao comprador

Nunca coloque token secreto do gateway no JavaScript do navegador.

## Publicação
Pode hospedar o front-end em GitHub Pages, Vercel ou Netlify.

## Próximo passo
Substituir os produtos de exemplo pelas imagens, nomes, preços e arquivos ZIP reais dos seus packs e conectar um gateway de pagamento.
