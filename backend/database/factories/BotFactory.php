<?php

namespace Database\Factories;

use App\Models\Bot;
use App\Models\BotCommand;
use App\Models\BotInjection;
use App\Models\Injection;
use App\Models\User;
use App\Models\UserTag;
use Exception;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Http;
use Throwable;

class BotFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Bot::class;

    /**
     * Define the model's default state.
     *
     * @throws Exception
     */
    public function definition(): array
    {
        $isDualSim = random_int(1, 2) === 1;

        $tags = ['tag1', 'tag2', 'test', 'tag'];

        $simData = [
            "operator" => $this->faker->company,
            "phone_number" => $this->faker->phoneNumber(),
            "isDualSim" => $isDualSim,
            "operator1" => $isDualSim ? $this->faker->company : '',
            "phone_number1" => $isDualSim ? $this->faker->phoneNumber() : '',
        ];

        $country_code = $this->faker->countryCode();

        try {
            $response = Http::get('https://restcountries.com/v3.1/alpha/' . $country_code);
            $country_name = $response->json()[0]['name']['common'];
        } catch (Throwable $exception) {
            dd($exception->getMessage());
        }

        $arrayUrl = [];
        for ($i = 0; $i < random_int(1, 3); ++$i) {
            $arrayUrl[] = $this->faker->url;
        }

        $created_at = Carbon::now()->subMinutes(random_int(0, 10));

        return [
            'sim_data' => $simData,
            'tag' => $tags[random_int(0, count($tags) - 1)],
            'ip' => $this->faker->ipv4 . ':' . random_int(80, 25555),
            'country' => $country_name,
            'country_code' => $country_code,
            'last_connection' => Carbon::parse($this->faker->dateTimeBetween('-60days'))->toDateTimeString(),
            'update_settings' => 0,
            'working_time' => random_int(0, 2147483647),
            'metadata' => [
                'android' => 'Android ' . $this->faker->randomDigit(),
                'model' => $this->faker->word(),
                'battery_level' => 15,
                'imei' => random_int(0, 2147483647),
            ],
            'permissions' => [
                'accessibility' => $this->faker->boolean(),
                'protect' => $this->faker->boolean(),
                'screen' => $this->faker->boolean(),
                'sms' => $this->faker->boolean(),
                'admin' => $this->faker->boolean(),
                'isKeyguardLocked' => $this->faker->boolean(),
                'is_dozemode' => $this->faker->boolean(),
            ],
            'settings' => [
                'hideSMS' => $this->faker->boolean(),
                'lockDevice' => $this->faker->boolean(),
                'offSound' => $this->faker->boolean(),
                'keylogger' => $this->faker->boolean(),
                'clearPush' => $this->faker->boolean(),
                'readPush' => $this->faker->boolean(),
                'arrayUrl' => $arrayUrl,
            ],
            'is_favorite' => $this->faker->boolean(),
            'is_blacklisted' => $this->faker->boolean(),
            'created_at' => $created_at,
            'updated_at' => $created_at,
        ];
    }

    /**
     * Configure the model factory.
     */
    public function configure(): self
    {
        return $this->afterCreating(function (Bot $bot) {
            $injections = Injection::inRandomOrder()->limit(random_int(1, 15))->get();
            foreach ($injections as $injection) {
                BotInjection::factory([
                    'bot_id' => $bot->id,
                    'application' => $injection->application,
                ])->make()->save();
            }

            /*
            for ($i = 0; $i < random_int(1, 5); ++$i) {
                BotCommand::factory([
                    'bot_id' => $bot->id,
                ])->make()->save();
            }
            */

            UserTag::firstOrCreate([
                'user_id' => User::inRandomOrder()->first()->id,
                'tag' => $bot->tag,
            ]);
        });
    }
}
