const fs = require('fs-extra')
const axios = require('axios')

const config = JSON.parse(fs.readFileSync('./config/config.json'))

let {
    prefix
} = config

module.exports = home = async (admin, message, horaAtual) => {
    try {
        const { type, id, from, t, sender, isGroupMsg, chat, chatId, caption, isMedia, mimetype, quotedMsg, quotedMsgObj, author, mentionedJidList, } = message
        let { body } = message
        var { name, formattedTitle, gcok } = chat
        let { pushname, verifiedName, formattedName } = sender
        pushname = pushname || verifiedName || formattedName // verifiedName is the name of someone who uses a business account
        const botNumber = await admin.getHostNumber() + '@c.us'
        const groupId = isGroupMsg ? chat.groupMetadata.id : ''
        const groupAdmins = isGroupMsg ? await admin.getGroupAdmins(groupId) : ''
        const isGroupAdmins = groupAdmins.includes(sender.id) || false
        const chats = (type === 'chat') ? body : (type === 'image' || type === 'video') ? caption : ''
        const isBotGroupAdmins = groupAdmins.includes(botNumber) || false
        const groupMembers = isGroupMsg ? await admin.getGroupMembersId(groupId) : ''
        const idusuario = sender.id

        // banco de dados
        let cadastradobasic = JSON.parse(fs.readFileSync('./banco/cadastrobasic.json'))

        // Bot Prefix
        body = (type === 'chat' && body.startsWith(prefix)) ? body : ((type === 'image' && caption || type === 'video' && caption) && caption.startsWith(prefix)) ? caption : ''
        const command = body.slice(1).trim().split(/ +/).shift().toLowerCase()
        const arg = body.trim().substring(body.indexOf(' ') + 1)
        const args = body.trim().split(/ +/).slice(1)


        // Consulta Funções Utilitarias
        const return_iscadastrobasic = iscadastrobasic(cadastradobasic, idusuario) // retorna se o usuario se cadastrou no bot
        const return_position = position(cadastradobasic, idusuario)
        const return_modooff = modooff(cadastradobasic, idusuario, return_position)


        // funções de gerenciamento
        function iscadastrobasic(cadastradobasic, idusuario) {
            let retorno = false
            let totalarray = cadastradobasic.length
            for (let i = 0; i < totalarray; i++) {
                if (cadastradobasic[i] == idusuario || cadastradobasic[i] == idusuario + " off ") {
                    retorno = true
                }
            }
            return retorno;
        }
        function position(cadastradobasic, idusuario) {
            let position
            let totalarray = cadastradobasic.length
            for (let i = 0; i < totalarray; i++) {
                if (cadastradobasic[i] == idusuario || cadastradobasic[i] == idusuario + " off ") {
                    position = i
                }
            }
            return position;
        }
        function modooff(cadastradobasic, idusuario, return_position) {
            let retorno = false
            if (cadastradobasic[return_position] == idusuario + " off ") {
                retorno = "off"
            }

            return retorno;
        }

        // inicio swtich 1
        if (command && command != "cadastrar") {
            if (return_iscadastrobasic == false) {
                admin.reply(from, `*${pushname}...* Você nao tem cadastro, envie *${prefix}cadastrar* e cadastre-se`, id)
            }
        }
        switch (command) {
            case 'cadastrar':
                //termina se o usuario nao tem argumentos e é cadastrado
                if (return_iscadastrobasic == true) return admin.reply(from, `Use o comando *${prefix}meusdados*\n\n    Caso você desativou seu perfil use o comando *${prefix}modo on*`, id)

                // Cadastrando usuario no arquivo json principal se caso nao estiver cadastrado já
                cadastradobasic.push(sender.id)
                fs.writeFileSync('./banco/cadastrobasic.json', JSON.stringify(cadastradobasic))
                admin.reply(from, `*[${command}]* - Ok, Você ja foi cadastrado(a)! para acessar seus dados. envie *${prefix}meusdados*`, id)
                break;
            case 'teste':
                console.log(message)
                break;
            case 'aviso':
            case 'aviso':
                if (!isGroupAdmins) return admin.reply(from, 'Falha, este comando só pode ser usado por administradores de grupo!', id)
                const memchu = chat.groupMetadata.participants.length
                const groupMem = await admin.getGroupMembers(groupId)
                let hehex = `Total Members : *${memchu}*\n\n╔══✪〘 Mencionando todos 〙✪══\n\n`
                for (let i = 0; i < groupMem.length; i++) {
                    hehex += '╠➥'
                    hehex += ` @${groupMem[i].id.replace(/@c.us/g, '')}\n`
                }
                hehex += '╚═〘 * Administração * 〙'
                await admin.sendTextWithMentions(from, ` a Pedido : ${pushname}\n` + `*Quem nao conversar no grupo! sera banido automaticamento do grupo..* ` + '\n\n' + hehex)
                await admin.ghostForward(from, hehex, id)
                break
            case 'noticias':
                console.log(args, "------------------- ",arg)

                if(arg != 1){
                axios.get(`http://servicodados.ibge.gov.br/api/v3/noticias/`).then(res => {
                
                let texto = `*Portal IBGE - API* por: ${pushname}\n\n_Total de Noticas: ${res.data.count}_\n`
                    for (let i = 1; i < 7; i++) {
                        console.log(res.data.items[i])
                        texto += `_[${i}] Noticia:_ ${res.data.items[i].titulo}\n`,
                        texto += `_[${i}] Link ibge:_ ${res.data.items[i].link} \n\n`
                    }
                    admin.reply(from, `${texto} \n\nSe quiser voce pode escolher uma noticia entre as *${res.data.count}* de Hoje! \nEnviando o comando *${prefix}noticias O_numero_Da_Noticia* ex: /noticias 67\n\n *HORA ATUAL: ${horaAtual}*`, id)
                    //   console.log(res)s
                })
            }
                if(arg > 1){
                    axios.get(`http://servicodados.ibge.gov.br/api/v3/noticias/`).then(res => {

                    let texto = `*Portal IBGE - API* por: ${pushname}\n\n_Total de Noticas: ${res.data.count}_\n`
                    texto += `_[${arg}] Noticia:_ ${res.data.items[arg].titulo}\n`,
                    texto += `_[${arg}] Link ibge:_ ${res.data.items[arg].link} \n\n`

                    admin.reply(from, `${texto} \n\nSe quiser voce pode escolher uma noticia entre as *${res.data.count}* de Hoje! \nEnviando o comando *${prefix}noticias O_numero_Da_Noticia* ex: /noticias 67\n\n *HORA ATUAL: ${horaAtual}*`, id)
                    })}
                break;
                case 'clima':
                    const mediaData = await decryptMedia(message)
                        const imageBase64 = `data:${mimetype};base64,${mediaData.toString('base64')}`
                        await aruga.setProfilePic(imageBase64)
                    break;
        } // fim do swtich 1


        // switch de comando 2 -------
        if (return_iscadastrobasic == true || return_modooff != "off") {
            switch (command) {
                case 'modo':
                    if (args == `on` && return_iscadastrobasic == true) {
                        if (return_modooff == false) return admin.reply(from, `Modo *on* na esta ativo!`, id)
                        cadastradobasic[return_position] = sender.id
                        fs.writeFileSync('./banco/cadastrobasic.json', JSON.stringify(cadastradobasic))
                        admin.reply(from, `*${pushname}* _Ativou seu cadastro!_  para desativar *${prefix}modo off*`, id)
                    }

                    // se args[1] de cadastrar for off e tiver cadastro ja - o usuario fica desativado do chat
                    if (args == `off` && return_iscadastrobasic == true) {
                        if (return_modooff == "off") return admin.reply(from, `Modo *off* na esta ativo!`, id)
                        cadastradobasic[return_position] = sender.id + " off "
                        fs.writeFileSync('./banco/cadastrobasic.json', JSON.stringify(cadastradobasic))
                        admin.reply(from, `*${pushname}* _desativou seu cadastro!_  para ativar *${prefix}modo on*`, id)
                    }
                    break;
                case `meusdados` + '5':
                    admin.reply(from, `tetse`, id)
                    break;

            }
        }




    } catch (err) {
        console.log(err)
    }

}