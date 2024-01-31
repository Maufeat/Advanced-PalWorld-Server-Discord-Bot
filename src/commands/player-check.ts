import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../discordBot";
import { exec } from "child_process";
import EOSClient from "../eosClient";

export default class ServerCheckCommand implements DiscordCommand {
    cmd: string = "check";
    description: string = "Show how many players are online on a specific server";
    slashCommand: any = new SlashCommandBuilder()
        .setName(this.cmd)
        .setDescription(this.description)
        .addStringOption((option) => option.setName("ip").setDescription("IP of the server to check").setRequired(true))
        .addIntegerOption((option) => option.setName("port").setDescription("Port of the server to check").setRequired(true));
    global: boolean = true;
    handler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
        const epicClient = new EOSClient();
        let criteria = [
            {
                "key": "attributes.ADDRESS_s",
                "op": "EQUAL",
                "value": interaction.options.getString("ip")
            },
            {
                "key": "attributes.GAMESERVER_PORT_l",
                "op": "EQUAL",
                "value": interaction.options.getInteger("port")
            }
        ];
        let content = await epicClient.queryMatchmaking(criteria, 1);
        if (content.count < 1) {
            await interaction.reply("No server found or offline.");
            return;
        }
        let playerCount = content.sessions[0].attributes.PLAYERS_l;
        let maxPlayerCount = content.sessions[0].attributes.NUMPUBLICCONNECTIONS_l;
        await interaction.reply(`${playerCount} / ${maxPlayerCount} players online.`);
    };
}