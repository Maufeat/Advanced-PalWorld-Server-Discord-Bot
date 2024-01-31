import { CacheType, ChatInputCommandInteraction } from "discord.js";
import { DiscordCommand } from "../discordBot";
import { exec } from "child_process";

export default class BackupCommand implements DiscordCommand {
    cmd: string = "backup";
    description: string = "Backup the Server";
    handler = async (interaction: ChatInputCommandInteraction<CacheType>) => {
        await interaction.reply("Backup PalServer...");
        exec(`"./scripts/backup.sh" ${process.env.PALWORLD_SERVER_DIR} ${process.env.PALWORLD_BACKUP_DIR}`, async (error, stdout, stderr) => {
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