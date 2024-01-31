import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { DiscordCommand } from "../discordBot";
import { exec } from "child_process";

export default class StartCommand implements DiscordCommand {
    cmd: string = "start";
    description: string = "Starts the Server";
    handler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
        await interaction.reply("Starting PalServer...");
        exec(`"./scripts/start-server.sh" ${process.env.PALWORLD_SERVER_DIR}`, async (error, stdout, stderr) => {
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