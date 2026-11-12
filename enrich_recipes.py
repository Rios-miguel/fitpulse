import json

# Mapa de ingredientes detalhados para cada receita
RECIPE_INGREDIENTS = {
    "rec_pao_com_ovo_1": [
        {"name": "Pão Francês de Padaria", "amount": "1 unidade (50g)", "calories": 150, "protein": 4.5, "carbs": 29.0, "fat": 1.5},
        {"name": "Ovo de Galinha Inteiro", "amount": "1 unidade (50g)", "calories": 74, "protein": 6.3, "carbs": 0.5, "fat": 5.0},
        {"name": "Azeite de Oliva / Manteiga", "amount": "1 fio de preparo (~3g)", "calories": 27, "protein": 0.0, "carbs": 0.0, "fat": 3.0}
    ],
    "rec_pao_com_2_ovos": [
        {"name": "Pão Francês de Padaria", "amount": "1 unidade (50g)", "calories": 150, "protein": 4.5, "carbs": 29.0, "fat": 1.5},
        {"name": "Ovos de Galinha Inteiros", "amount": "2 unidades (100g)", "calories": 148, "protein": 12.6, "carbs": 1.0, "fat": 10.0},
        {"name": "Azeite de Oliva / Manteiga", "amount": "1 fio de preparo (~3g)", "calories": 27, "protein": 0.0, "carbs": 0.0, "fat": 3.0}
    ],
    "rec_pao_na_chapa": [
        {"name": "Pão Francês de Padaria", "amount": "1 unidade (50g)", "calories": 150, "protein": 4.5, "carbs": 29.0, "fat": 1.5},
        {"name": "Manteiga com Sal", "amount": "1 ponta de faca (10g)", "calories": 75, "protein": 0.1, "carbs": 0.0, "fat": 8.7}
    ],
    "rec_misto_quente": [
        {"name": "Pão de Forma Tradicional", "amount": "2 fatias (50g)", "calories": 130, "protein": 4.5, "carbs": 25.0, "fat": 1.5},
        {"name": "Queijo Muçarela", "amount": "1 fatia (25g)", "calories": 70, "protein": 5.5, "carbs": 0.5, "fat": 5.5},
        {"name": "Presunto Cozido", "amount": "1 fatia (25g)", "calories": 45, "protein": 3.5, "carbs": 0.5, "fat": 3.2},
        {"name": "Manteiga para dourar", "amount": "5g", "calories": 40, "protein": 0.0, "carbs": 0.0, "fat": 4.5}
    ],
    "rec_crepioca_fit": [
        {"name": "Ovo de Galinha Inteiro", "amount": "1 unidade (50g)", "calories": 74, "protein": 6.3, "carbs": 0.5, "fat": 5.0},
        {"name": "Goma de Tapioca Hidratada", "amount": "2 colheres de sopa (30g)", "calories": 72, "protein": 0.0, "carbs": 18.0, "fat": 0.0}
    ],
    "rec_crepioca_frango_queijo": [
        {"name": "Massa de Crepioca (Ovo + Tapioca)", "amount": "Massa base (80g)", "calories": 146, "protein": 6.3, "carbs": 18.5, "fat": 5.0},
        {"name": "Peito de Frango Cozido Desfiado", "amount": "40g", "calories": 64, "protein": 12.8, "carbs": 0.0, "fat": 1.0},
        {"name": "Queijo Minas Frescal", "amount": "25g", "calories": 48, "protein": 3.4, "carbs": 0.6, "fat": 3.6}
    ],
    "rec_tapioca_frango_requeijao": [
        {"name": "Goma de Tapioca Hidratada", "amount": "4 colheres de sopa (60g)", "calories": 144, "protein": 0.0, "carbs": 36.0, "fat": 0.0},
        {"name": "Peito de Frango Desfiado", "amount": "60g", "calories": 95, "protein": 19.2, "carbs": 0.0, "fat": 1.5},
        {"name": "Requeijão Cremoso Tradicional", "amount": "1 colher de sopa (20g)", "calories": 50, "protein": 1.8, "carbs": 1.0, "fat": 4.0}
    ],
    "rec_tapioca_manteiga": [
        {"name": "Goma de Tapioca Hidratada", "amount": "4 colheres de sopa (60g)", "calories": 144, "protein": 0.0, "carbs": 36.0, "fat": 0.0},
        {"name": "Manteiga com Sal Derretida", "amount": "8g", "calories": 61, "protein": 0.1, "carbs": 0.0, "fat": 6.8}
    ],
    "rec_panqueca_banana_aveia": [
        {"name": "Banana Nanica Madura", "amount": "1 unidade (80g)", "calories": 74, "protein": 1.1, "carbs": 19.0, "fat": 0.1},
        {"name": "Ovo de Galinha Inteiro", "amount": "1 unidade (50g)", "calories": 74, "protein": 6.3, "carbs": 0.5, "fat": 5.0},
        {"name": "Aveia em Flocos Finos", "amount": "2 colheres de sopa (20g)", "calories": 79, "protein": 2.8, "carbs": 13.3, "fat": 1.7}
    ],
    "rec_mingau_aveia": [
        {"name": "Leite Desnatado", "amount": "1 copo (200ml)", "calories": 70, "protein": 6.6, "carbs": 9.6, "fat": 0.2},
        {"name": "Aveia em Flocos", "amount": "3 colheres de sopa (30g)", "calories": 118, "protein": 4.2, "carbs": 20.0, "fat": 2.5},
        {"name": "Mel de Abelha Puro", "amount": "1 colher de sobremesa (10g)", "calories": 30, "protein": 0.0, "carbs": 8.2, "fat": 0.0}
    ],
    "rec_overnight_oats": [
        {"name": "Aveia em Flocos", "amount": "30g", "calories": 118, "protein": 4.2, "carbs": 20.0, "fat": 2.5},
        {"name": "Iogurte Natural Desnatado", "amount": "100g", "calories": 45, "protein": 4.5, "carbs": 6.0, "fat": 0.2},
        {"name": "Morangos Frescos", "amount": "50g", "calories": 15, "protein": 0.3, "carbs": 3.4, "fat": 0.1},
        {"name": "Sementes de Chia", "amount": "10g", "calories": 49, "protein": 1.7, "carbs": 4.2, "fat": 3.1}
    ],
    "rec_shake_whey_agua": [
        {"name": "Whey Protein Concentrado 80%", "amount": "1 scoop dosador (30g)", "calories": 120, "protein": 24.0, "carbs": 2.4, "fat": 1.8},
        {"name": "Água Filtrada / Gelada", "amount": "200ml", "calories": 0, "protein": 0.0, "carbs": 0.0, "fat": 0.0}
    ],
    "rec_shake_whey_leite_desnatado": [
        {"name": "Whey Protein Concentrado 80%", "amount": "1 scoop dosador (30g)", "calories": 120, "protein": 24.0, "carbs": 2.4, "fat": 1.8},
        {"name": "Leite Desnatado Gelado", "amount": "1 copo (200ml)", "calories": 70, "protein": 6.6, "carbs": 9.6, "fat": 0.2}
    ],
    "rec_shake_anabolico_hipercalorico": [
        {"name": "Whey Protein Concentrado 80%", "amount": "1 scoop (30g)", "calories": 120, "protein": 24.0, "carbs": 2.4, "fat": 1.8},
        {"name": "Banana Prata", "amount": "1 unidade média (70g)", "calories": 68, "protein": 0.9, "carbs": 18.0, "fat": 0.1},
        {"name": "Aveia em Flocos", "amount": "3 colheres de sopa (30g)", "calories": 118, "protein": 4.2, "carbs": 20.0, "fat": 2.5},
        {"name": "Pasta de Amendoim Integral", "amount": "1 colher de sopa (20g)", "calories": 118, "protein": 5.0, "carbs": 4.0, "fat": 10.0},
        {"name": "Leite Integral", "amount": "1 copo (200ml)", "calories": 120, "protein": 6.4, "carbs": 9.2, "fat": 6.4}
    ],
    "rec_iogurte_granola_banana": [
        {"name": "Iogurte Natural Integral", "amount": "1 pote (130g)", "calories": 78, "protein": 4.5, "carbs": 6.0, "fat": 4.5},
        {"name": "Granola Crocante Tradicional", "amount": "3 colheres de sopa (30g)", "calories": 125, "protein": 3.0, "carbs": 22.0, "fat": 2.8},
        {"name": "Banana Prata Fatiada", "amount": "1/2 unidade (40g)", "calories": 39, "protein": 0.5, "carbs": 10.0, "fat": 0.1}
    ],
    "rec_mousse_whey_frutas": [
        {"name": "Iogurte Natural Desnatado", "amount": "100g", "calories": 45, "protein": 4.5, "carbs": 6.0, "fat": 0.2},
        {"name": "Whey Protein Sabor Baunilha/Morango", "amount": "20g", "calories": 80, "protein": 16.0, "carbs": 1.6, "fat": 1.2},
        {"name": "Morangos Frescos Picados", "amount": "40g", "calories": 12, "protein": 0.2, "carbs": 2.8, "fat": 0.1}
    ],
    "rec_omelete_completo": [
        {"name": "Ovos de Galinha Inteiros", "amount": "3 unidades (150g)", "calories": 222, "protein": 18.9, "carbs": 1.5, "fat": 15.0},
        {"name": "Queijo Muçarela Ralado", "amount": "25g", "calories": 70, "protein": 5.5, "carbs": 0.5, "fat": 5.5},
        {"name": "Peito de Frango Cozido Desfiado", "amount": "40g", "calories": 64, "protein": 12.8, "carbs": 0.0, "fat": 1.0},
        {"name": "Tomate Picado e Ervas Frescas", "amount": "30g", "calories": 6, "protein": 0.3, "carbs": 1.0, "fat": 0.1}
    ],
    "rec_prato_feito_pf": [
        {"name": "Arroz Branco Cozido", "amount": "3 colheres de servir (150g)", "calories": 195, "protein": 4.0, "carbs": 42.0, "fat": 0.4},
        {"name": "Feijão Carioca Cozido (grão + caldo)", "amount": "1 concha média (100g)", "calories": 76, "protein": 4.8, "carbs": 13.6, "fat": 0.5},
        {"name": "Bife Bovino Magro Grelhado (Alcatra/Patinho)", "amount": "1 filé médio (120g)", "calories": 263, "protein": 37.2, "carbs": 0.0, "fat": 12.0},
        {"name": "Salada de Alface, Tomate e Fio de Azeite", "amount": "60g", "calories": 30, "protein": 0.8, "carbs": 2.0, "fat": 2.2}
    ],
    "rec_prato_fit_frango_arroz_feijao": [
        {"name": "Arroz Branco ou Integral Cozido", "amount": "3 colheres de servir (150g)", "calories": 195, "protein": 4.0, "carbs": 42.0, "fat": 0.4},
        {"name": "Feijão Carioca Cozido", "amount": "1 concha média (100g)", "calories": 76, "protein": 4.8, "carbs": 13.6, "fat": 0.5},
        {"name": "Peito de Frango Grelhado", "amount": "1 filé grande (150g)", "calories": 238, "protein": 48.0, "carbs": 0.0, "fat": 3.8}
    ],
    "rec_frango_com_batata_doce": [
        {"name": "Peito de Frango Grelhado", "amount": "1 filé grande (150g)", "calories": 238, "protein": 48.0, "carbs": 0.0, "fat": 3.8},
        {"name": "Batata Doce Cozida com Casca", "amount": "1 unidade média (150g)", "calories": 116, "protein": 0.9, "carbs": 27.6, "fat": 0.2}
    ],
    "rec_strogonoff_frango": [
        {"name": "Arroz Branco Cozido", "amount": "3 colheres de servir (150g)", "calories": 195, "protein": 4.0, "carbs": 42.0, "fat": 0.4},
        {"name": "Strogonoff de Frango (frango + creme de leite + champignon)", "amount": "1 concha cheia (150g)", "calories": 285, "protein": 29.5, "carbs": 6.0, "fat": 16.0},
        {"name": "Batata Palha Tradicional", "amount": "2 colheres de sopa (20g)", "calories": 100, "protein": 1.5, "carbs": 10.0, "fat": 6.0}
    ],
    "rec_strogonoff_carne": [
        {"name": "Arroz Branco Cozido", "amount": "3 colheres de servir (150g)", "calories": 195, "protein": 4.0, "carbs": 42.0, "fat": 0.4},
        {"name": "Strogonoff de Carne Bovina (Patinho/Alcatra)", "amount": "1 concha cheia (150g)", "calories": 335, "protein": 34.5, "carbs": 6.0, "fat": 19.5},
        {"name": "Batata Palha Tradicional", "amount": "2 colheres de sopa (20g)", "calories": 100, "protein": 1.5, "carbs": 10.0, "fat": 6.0}
    ],
    "rec_escondidinho_mandioca_carne": [
        {"name": "Purê de Mandioca / Aipim com Leite", "amount": "150g", "calories": 188, "protein": 0.9, "carbs": 45.0, "fat": 0.5},
        {"name": "Carne Moída Patinho Refogada", "amount": "100g", "calories": 219, "protein": 35.0, "carbs": 0.0, "fat": 7.3},
        {"name": "Queijo Parmesão Gratinado", "amount": "1 colher de sopa (10g)", "calories": 40, "protein": 3.5, "carbs": 0.3, "fat": 2.8}
    ],
    "rec_macarrao_bolonhesa": [
        {"name": "Macarrão Espaguete Cozido", "amount": "1 prato fundo (200g)", "calories": 280, "protein": 10.0, "carbs": 56.0, "fat": 1.6},
        {"name": "Molho Bolonhesa com Carne Moída", "amount": "120g", "calories": 140, "protein": 13.0, "carbs": 8.5, "fat": 5.0},
        {"name": "Queijo Parmesão Ralado", "amount": "1 colher de sopa (10g)", "calories": 40, "protein": 3.5, "carbs": 0.3, "fat": 2.8}
    ],
    "rec_feijoada_completa": [
        {"name": "Feijoada com Feijão Preto e Carnes Variadas", "amount": "2 conchas (200g)", "calories": 360, "protein": 28.0, "carbs": 22.0, "fat": 18.0},
        {"name": "Arroz Branco Cozido", "amount": "3 colheres de servir (150g)", "calories": 195, "protein": 4.0, "carbs": 42.0, "fat": 0.4},
        {"name": "Couve Manteiga Refogada no Alho e Azeite", "amount": "50g", "calories": 45, "protein": 1.5, "carbs": 4.0, "fat": 2.6}
    ],
    "rec_baiao_de_dois": [
        {"name": "Arroz Branco com Feijão Fradinho / Corda", "amount": "200g", "calories": 240, "protein": 7.5, "carbs": 48.0, "fat": 1.0},
        {"name": "Carne Seca Dessalgada Desfiada", "amount": "60g", "calories": 150, "protein": 16.0, "carbs": 0.0, "fat": 9.5},
        {"name": "Queijo de Coalho em Cubos Grelhado", "amount": "40g", "calories": 140, "protein": 9.0, "carbs": 1.0, "fat": 11.5}
    ],
    "rec_pudim_leite_tradicional": [
        {"name": "Leite Condensado Integral", "amount": "50g", "calories": 160, "protein": 3.6, "carbs": 27.5, "fat": 4.2},
        {"name": "Leite Integral de Vaca", "amount": "40ml", "calories": 24, "protein": 1.3, "carbs": 1.8, "fat": 1.3},
        {"name": "Ovo de Galinha", "amount": "15g (fração)", "calories": 22, "protein": 1.9, "carbs": 0.1, "fat": 1.5},
        {"name": "Calda de Açúcar Caramelizado", "amount": "1 colher de sopa (15g)", "calories": 58, "protein": 0.0, "carbs": 15.0, "fat": 0.0}
    ],
    "rec_pudim_fit_whey": [
        {"name": "Whey Protein Sabor Baunilha", "amount": "20g", "calories": 80, "protein": 16.0, "carbs": 1.6, "fat": 1.2},
        {"name": "Leite Desnatado", "amount": "60ml", "calories": 21, "protein": 2.0, "carbs": 2.9, "fat": 0.1},
        {"name": "Clara de Ovo + Gema", "amount": "25g", "calories": 24, "protein": 2.7, "carbs": 0.2, "fat": 1.3}
    ],
    "rec_acai_tigela_completo": [
        {"name": "Creme de Açaí c/ Xarope de Guaraná", "amount": "200g", "calories": 220, "protein": 2.0, "carbs": 44.0, "fat": 4.0},
        {"name": "Banana Prata Fatiada", "amount": "1 unidade média (70g)", "calories": 68, "protein": 0.9, "carbs": 18.0, "fat": 0.1},
        {"name": "Granola Crocante", "amount": "3 colheres de sopa (30g)", "calories": 125, "protein": 3.0, "carbs": 22.0, "fat": 2.8}
    ],
    "rec_bolo_cenoura_chocolate": [
        {"name": "Massa Fofa de Bolo de Cenoura", "amount": "60g", "calories": 190, "protein": 2.6, "carbs": 29.0, "fat": 7.2},
        {"name": "Calda Quente de Brigadeiro", "amount": "20g", "calories": 105, "protein": 1.2, "carbs": 14.0, "fat": 5.3}
    ],
    "rec_brigadeiro_tradicional": [
        {"name": "Leite Condensado Cozido", "amount": "15g", "calories": 48, "protein": 1.1, "carbs": 8.3, "fat": 1.3},
        {"name": "Cacau / Chocolate em Pó e Manteiga", "amount": "3g", "calories": 14, "protein": 0.4, "carbs": 1.0, "fat": 1.1},
        {"name": "Chocolate Granulado de Cobertura", "amount": "3g", "calories": 14, "protein": 0.2, "carbs": 2.5, "fat": 0.4}
    ],
    "rec_brownie_chocolate": [
        {"name": "Chocolate Meio Amargo Nobre Derretido", "amount": "20g", "calories": 105, "protein": 1.2, "carbs": 12.0, "fat": 6.2},
        {"name": "Manteiga e Ovos", "amount": "15g", "calories": 75, "protein": 1.5, "carbs": 0.2, "fat": 7.5},
        {"name": "Farinha, Açúcar e Nozes Picadas", "amount": "25g", "calories": 70, "protein": 0.8, "carbs": 15.0, "fat": 1.0}
    ],
    "rec_panqueca_carne_moida": [
        {"name": "Discos de Massa de Panqueca Caseira", "amount": "2 unidades (80g)", "calories": 120, "protein": 4.0, "carbs": 18.0, "fat": 3.5},
        {"name": "Carne Moída Patinho Refogada", "amount": "100g", "calories": 165, "protein": 18.0, "carbs": 0.0, "fat": 8.5},
        {"name": "Molho de Tomate ao Sugo Caseiro", "amount": "40g", "calories": 20, "protein": 0.8, "carbs": 4.0, "fat": 0.2}
    ],
    "rec_pao_de_queijo": [
        {"name": "Polvilho Azedo e Doce", "amount": "20g", "calories": 70, "protein": 0.0, "carbs": 17.0, "fat": 0.0},
        {"name": "Queijo Meia Cura / Parmesão Ralado", "amount": "15g", "calories": 55, "protein": 4.2, "carbs": 0.4, "fat": 4.2},
        {"name": "Leite, Óleo e Ovo da massa", "amount": "15g", "calories": 15, "protein": 0.8, "carbs": 0.2, "fat": 1.2}
    ],
    "rec_coxinha_frango": [
        {"name": "Massa de Coxinha com Caldo", "amount": "70g", "calories": 130, "protein": 2.5, "carbs": 22.0, "fat": 3.5},
        {"name": "Recheio de Frango com Catupiry", "amount": "40g", "calories": 95, "protein": 8.5, "carbs": 1.0, "fat": 6.5},
        {"name": "Óleo Vegetal absorvido", "amount": "6g", "calories": 60, "protein": 0.0, "carbs": 0.0, "fat": 6.7}
    ],
    "rec_omelete_claras_fitness": [
        {"name": "Claras de Ovo Pasteurizadas/Frescas", "amount": "150g (aprox. 5 claras)", "calories": 78, "protein": 16.5, "carbs": 1.1, "fat": 0.3},
        {"name": "Peito de Frango Cozido Desfiado", "amount": "60g", "calories": 95, "protein": 19.2, "carbs": 0.0, "fat": 1.5},
        {"name": "Tomate Picado, Ervas e Fio de Azeite", "amount": "15g", "calories": 42, "protein": 0.3, "carbs": 0.5, "fat": 4.2}
    ],
    "rec_vitamina_banana_aveia": [
        {"name": "Leite Desnatado", "amount": "1 copo (200ml)", "calories": 70, "protein": 6.6, "carbs": 9.6, "fat": 0.2},
        {"name": "Banana Prata Madura", "amount": "1 unidade (80g)", "calories": 78, "protein": 1.0, "carbs": 20.8, "fat": 0.1},
        {"name": "Aveia em Flocos Finos", "amount": "2 colheres de sopa (20g)", "calories": 79, "protein": 2.8, "carbs": 13.3, "fat": 1.7},
        {"name": "Mel de Abelha Puro", "amount": "1 colher de chá (8g)", "calories": 28, "protein": 0.1, "carbs": 6.5, "fat": 0.0}
    ],
    "rec_vitamina_abacate": [
        {"name": "Polpa de Abacate Maduro", "amount": "100g", "calories": 160, "protein": 2.0, "carbs": 6.0, "fat": 15.0},
        {"name": "Leite Integral de Vaca", "amount": "150ml", "calories": 90, "protein": 4.8, "carbs": 6.9, "fat": 4.8},
        {"name": "Gotas de Limão e Adoçante", "amount": "5g", "calories": 5, "protein": 0.0, "carbs": 1.2, "fat": 0.0}
    ],
    "rec_salmao_legumes": [
        {"name": "Filé de Salmão Fresco Grelhado", "amount": "1 filé (150g)", "calories": 280, "protein": 30.0, "carbs": 0.0, "fat": 18.0},
        {"name": "Brócolis, Cenoura e Abobrinha no Vapor", "amount": "150g", "calories": 60, "protein": 3.5, "carbs": 10.0, "fat": 0.5},
        {"name": "Fio de Azeite de Oliva Extra Virgem", "amount": "4g", "calories": 35, "protein": 0.0, "carbs": 0.0, "fat": 4.0}
    ],
    "rec_bolo_fuba": [
        {"name": "Fubá Mimoso de Milho", "amount": "25g", "calories": 90, "protein": 1.8, "carbs": 19.0, "fat": 0.8},
        {"name": "Farinha de Trigo, Açúcar e Leite", "amount": "25g", "calories": 75, "protein": 1.5, "carbs": 14.5, "fat": 1.0},
        {"name": "Ovo e Óleo de Girassol", "amount": "10g", "calories": 30, "protein": 0.7, "carbs": 0.1, "fat": 3.0}
    ],
    "rec_acai_polpa_pura": [
        {"name": "Polpa Pura de Açaí Médio Congelada (100%)", "amount": "100g", "calories": 65, "protein": 1.5, "carbs": 1.5, "fat": 6.0}
    ],
    "rec_pipoca_panela": [
        {"name": "Milho para Pipoca Estourado", "amount": "50g grãos crus", "calories": 180, "protein": 5.0, "carbs": 35.0, "fat": 2.0},
        {"name": "Óleo de Girassol / Milho para estourar", "amount": "4g", "calories": 30, "protein": 0.0, "carbs": 0.0, "fat": 3.3}
    ]
}

with open("taco_database.json", "r", encoding="utf-8") as f:
    foods = json.load(f)

updated_count = 0
for food in foods:
    fid = food.get("id")
    if fid in RECIPE_INGREDIENTS:
        food["ingredients"] = RECIPE_INGREDIENTS[fid]
        updated_count += 1

print(f"Injected detailed ingredients into {updated_count} recipes.")

with open("taco_database.json", "w", encoding="utf-8") as f:
    json.dump(foods, f, ensure_ascii=False, indent=2)

print("Saved taco_database.json with ingredient lists.")
