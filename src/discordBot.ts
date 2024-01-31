import { Client, IntentsBitField, ActivityType, REST, Routes, Interaction, ChatInputCommandInteraction, CacheType, GuildMemberRoleManager } from "discord.js";
import StartCommand from "./commands/start";
import ShutdownCommand from "./commands/shutdown";
import BackupCommand from "./commands/backup";
import EOSClient from "./eosClient";

export interface DiscordCommand {
    cmd: string;
    description: string;
    handler: (interaction: ChatInputCommandInteraction<CacheType>) => Promise<void>;
}

export default class DiscordBot {

    private client: Client;
    private rest: REST;

    private commands: DiscordCommand[] = [];

    registerCommands() {
        this.commands.push(new StartCommand);
        this.commands.push(new ShutdownCommand);
        this.commands.push(new BackupCommand);
    }

    async registerCommandsToServer() {
        await this.rest.put(Routes.applicationCommands(process.env.DISCORD_BOT_ID), {
            body: this.commands.map((command) => ({
                name: command.cmd,
                description: command.description,
            })),
        });
        console.log("Slash Commands Registered");
    }

    public async start() {
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMembers,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
            ],
        });
        this.rest = new REST({ version: "10" }).setToken(
            process.env.DISCORD_BOT_TOKEN
        );
        this.registerCommands();
        this.client.on("ready", this.onReady);
        this.client.on("interactionCreate", (i) => this.onInteraction(i, this.commands));
        await this.registerCommandsToServer();
        setInterval(async () => {
            this.updateActivity();
        }, Number(process.env.DISCORD_ACTIVITY_INTERVAL) * 1000);
        await this.client.login(process.env.DISCORD_BOT_TOKEN);
    }

    async updateActivity() {
        const epicClient = new EOSClient();
        let criteria = [
            {
                "key": "attributes.ADDRESS_s",
                "op": "EQUAL",
                "value": process.env.PALWORLD_SERVER_IP
            },
            {
                "key": "attributes.GAMESERVER_PORT_l",
                "op": "EQUAL",
                "value": Number(process.env.PALWORLD_SERVER_PORT)
            }
        ];
        let content = await epicClient.queryMatchmaking(criteria, 1);
        if (content.count < 1) {
            this.client.user?.setActivity({
                name: `Server offline.`,
                type: ActivityType.Watching
            });
            return;
        }
        let playerCount = content.sessions[0].attributes.PLAYERS_l;
        let maxPlayerCount = content.sessions[0].attributes.NUMPUBLICCONNECTIONS_l;
        this.client.user?.setActivity({
            name: `Playing ${playerCount} / ${maxPlayerCount}`,
            type: ActivityType.Playing
        });
    }

    onReady(client: Client) {
        console.log(`Logged in as ${client.user?.tag}`);
    }

    async onInteraction(interaction: Interaction, commands: DiscordCommand[]) {
        if (!interaction.isChatInputCommand()) return;
        if (!(interaction.member.roles as GuildMemberRoleManager).cache.has(process.env.DISCORD_ROLE_ID)) {
            await interaction.reply({
                content: `You don't have the required role to use this command`,
                ephemeral: true
            });
            return;
        }
        const command = commands.find(c => c.cmd === interaction.commandName);
        if (!command) return;
        if (interaction.channelId !== process.env.DISCORD_CHANNEL_ID) {
            await interaction.reply({
                content: `This command can only be used in <#${process.env.DISCORD_CHANNEL_ID}>`,
                ephemeral: true
            });
            return;
        }
        console.log(`${interaction.user.tag} used ${interaction.commandName}`);
        await command.handler(interaction);
    }
}