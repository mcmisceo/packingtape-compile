give @s $magilore:magic_wand
setblock ~ ~ ~ minecraft:dropper{Items:[{Slot:0,id:"$magilore:magic_wand"}]}
execute if entity @s[nbt={SelectedItem:{id:"$magilore:magic_wand"}}]
