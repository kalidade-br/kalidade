export default async function handler(req, res) {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
    );

    // Preflight
    if (req.method === "OPTIONS") {
        return res.status(204).end();
    }

    if (req.method !== "GET") {
        return res.status(405).json({
            erro: "Método não permitido",
            permitido: "GET"
        });
    }

    const numero = req.query.numero;

    if (!numero) {
        return res.status(400).json({
            erro: "Parâmetro obrigatório",
            exemplo: "/api/numero?numero=5583987145402"
        });
    }

    // Aceita números de diferentes países.
    const numeroLimpo = String(numero).replace(/[^\d+]/g, "");

    if (numeroLimpo.length < 7) {
        return res.status(400).json({
            erro: "Número inválido"
        });
    }

    /*
     * Coloque aqui somente dados obtidos de uma fonte
     * para a qual você tenha autorização.
     *
     * Exemplo de estrutura de resposta:
     */
    const dados = {
        numero: numeroLimpo,
        location: {
            city: null,
            country: null,
            country_code: null,
            region: null,
            operator: null,
            operator_fullname: null
        },
        volumetric: {
            total: null,
            size_message: null,
            size_media: null,
            size_contacts: null
        },
        result: {
            uid: numeroLimpo,
            first_name: "",
            last_name: ""
        }
    };

    // Resposta organizada em português
    return res.status(200).json({
        sucesso: true,

        "CONSULTA": {
            "NÚMERO": dados.numero
        },

        "LOCALIZAÇÃO": {
            "CIDADE": dados.location.city || "Não informado",
            "PAÍS": dados.location.country || "Não informado",
            "CÓDIGO DO PAÍS": dados.location.country_code || "Não informado",
            "REGIÃO": dados.location.region || "Não informado"
        },

        "OPERADORA": {
            "NOME": dados.location.operator_fullname || "Não informado",
            "CÓDIGO": dados.location.operator || "Não informado"
        },

        "CONSUMO": {
            "TOTAL": dados.volumetric.total || "Não informado",
            "MENSAGENS": dados.volumetric.size_message || "Não informado",
            "MÍDIA": dados.volumetric.size_media || "Não informado",
            "CONTATOS": dados.volumetric.size_contacts || "Não informado"
        },

        "USUÁRIO": {
            "NOME": dados.result.first_name || "Não informado",
            "SOBRENOME": dados.result.last_name || "Não informado"
        }
    });
          }
