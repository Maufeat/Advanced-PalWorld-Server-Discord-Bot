import { CacheType, ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { DiscordCommand } from "../discordBot";
import { exec } from "child_process";

export default class ShutdownCommand implements DiscordCommand {
    cmd: string = "shutdown";
    description: string = "Shutdown the Server";
    slashCommand: any = new SlashCommandBuilder()
        .setName(this.cmd)
        .setDescription(this.description);
    global: boolean = false;
    handler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
        await interaction.reply("Shutdown PalServer...");
        exec(`"./scripts/stop-server.sh" ${process.env.PALWORLD_SERVER_DIR}`, async (error, stdout, stderr) => {
            if (error) {
                if (stderr !== "")
                    await interaction.editReply(stderr);
                return;
            }
            if (stdout !== "")
                await interaction.editReply(stdout);
        });
    };
}