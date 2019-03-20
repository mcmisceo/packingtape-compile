give @s $magilore:magic_wand{display:{Name:"{\"text\":\"Magic Wand\",\"color\":\"dark_purple\"}"},foo:bar}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$magilore:magic_wand"}]}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$mechanization:mystic_chestplate",tag:{foo:bar}},{Slot:1,id:"$mechanization:mystic_chestplate",tag:{bar:foo}}]}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$mechanization:mystic_chestplate",tag:{foo:bar}},{Slot:1,id:"$magilore:fire_wand",tag:{bar:foo}},{Slot:1,id:"$magilore:magic_wand",tag:{bar:foo}}]}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$magilore:magic_wand",Damage:5,foobar:barfoo},{Slot:1,id:"$magilore:fire_wand",tag:{bar:foo}}]}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$magilore:magic_wand",tag:{display:{Name:"{\"text\":\"Magic Wand\",\"color\":\"dark_purple\"}"},foo:bar}}]}
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$magilore:magic_wand"}]}
execute if entity @s[nbt={SelectedItem:{id:"$magilore:magic_wand"}}]
