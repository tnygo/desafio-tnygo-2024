class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: ['macaco'], espacoOcupado: 3 },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [], espacoOcupado: 0 },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: ['gazela'], espacoOcupado: 2 },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [], espacoOcupado: 0 },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: ['leao'], espacoOcupado: 3 }
        ];

        this.animaisPermitidos = {
            'LEAO': { tamanho: 3, bioma: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, bioma: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, bioma: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, bioma: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, bioma: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, bioma: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(tipoAnimal, quantidade) {
        // Validações de animal e quantidade
        if (!this.animaisPermitidos[tipoAnimal.toUpperCase()]) {
            return { erro: "Animal inválido" };
        }

        if (quantidade < 1) {
            return { erro: "Quantidade inválida" };
        }

        const animal = this.animaisPermitidos[tipoAnimal.toUpperCase()];
        const tamanhoTotal = quantidade * animal.tamanho;
        let recintosViaveis = [];

        // Verificação dos recintos
        for (let recinto of this.recintos) {
            let espacoLivre = recinto.tamanho - recinto.espacoOcupado;

            // Validação de bioma
            if (!animal.bioma.includes(recinto.bioma.split(' e ')[0]) && !animal.bioma.includes(recinto.bioma.split(' e ')[1])) {
                continue;
            }

            // Validação de compatibilidade com animais existentes
            if (recinto.animais.length > 0) {
                if (animal.carnivoro || recinto.animais.some(a => this.animaisPermitidos[a.toUpperCase()]?.carnivoro)) {
                    if (!recinto.animais.includes(tipoAnimal.toLowerCase())) {
                        continue; // Carnívoros só podem estar com a mesma espécie
                    }
                }

                // Adicionar espaço extra se houver múltiplas espécies
                if (!recinto.animais.includes(tipoAnimal.toLowerCase())) {
                    espacoLivre -= 1;
                }
            }

            // Regras para macacos
            if (tipoAnimal.toUpperCase() === 'MACACO' && recinto.animais.length === 0 && quantidade < 2) {
                continue; // Macacos não podem ficar sozinhos
            }

            // Validar se há espaço suficiente
            if (espacoLivre >= tamanhoTotal) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoLivre - tamanhoTotal,
                    espacoTotal: recinto.tamanho
                });
            }
        }

        // Ordenar os recintos viáveis por número
        recintosViaveis.sort((a, b) => a.numero - b.numero);

        if (recintosViaveis.length > 0) {
            return {
                recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`)
            };
        } else {
            return { erro: "Não há recinto viável" };
        }
    }
}

export { RecintosZoo as RecintosZoo };
